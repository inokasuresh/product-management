// const express = require('express');
// const inMemoryPublisher = require('../publishers/inMemoryPublisher');
//
// const router = express.Router();
//
// // subscribers per seller
// const subscribers = {};
//
// router.get('/stream', (req, res) => {
//     const sellerId = req.query.sellerId;
//     if (!sellerId) return res.status(400).send("sellerId required");
//
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.flushHeaders();
//
//     if (!subscribers[sellerId]) subscribers[sellerId] = [];
//     subscribers[sellerId].push(res);
//
//     req.on('close', () => {
//         subscribers[sellerId] = subscribers[sellerId].filter(r => r !== res);
//     });
// });
//
// // hook publisher to push LowStockWarning
// const originalPublish = inMemoryPublisher.publish;
// inMemoryPublisher.publish = async function(event) {
//     await originalPublish(event);
//     if (event.event_type === "LowStockWarning") {
//         const subs = subscribers[event.seller_id] || [];
//         subs.forEach(res => {
//             res.write(`data: ${JSON.stringify(event)}\n\n`);
//         });
//     }
// };
//
// module.exports = router;


const express = require('express');
const { Kafka } = require('kafkajs');

const router = express.Router();

// Track subscribers per sellerId
const subscribers = {};

// SSE endpoint
router.get('/stream', (req, res) => {
    const sellerId = req.query.sellerId;
    if (!sellerId) return res.status(400).send("sellerId required");

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();

    if (!subscribers[sellerId]) subscribers[sellerId] = [];
    subscribers[sellerId].push(res);

    req.on('close', () => {
        subscribers[sellerId] = subscribers[sellerId].filter(r => r !== res);
    });
});

// Kafka consumer setup
async function startKafkaConsumer() {
    // const kafka = new Kafka({ brokers: ['localhost:9092'] });
    const kafka = new Kafka({ brokers: (process.env.KAFKA_BROKERS || 'kafka:9092').split(',') });
    const consumer = kafka.consumer({ groupId: 'sse-notification-service' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'LowStockWarning', fromBeginning: false });
    await consumer.subscribe({ topic: 'ProductCreated', fromBeginning: false });
    await consumer.subscribe({ topic: 'ProductUpdated', fromBeginning: false });
    await consumer.subscribe({ topic: 'ProductDeleted', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const event = JSON.parse(message.value.toString());
                console.log(`[SSE Consumer] ${event.event_type} for seller=${event.seller_id} payload=${JSON.stringify(event.payload)}`);

                // Push to SSE subscribers for this seller
                const subs = subscribers[event.seller_id] || [];
                subs.forEach(res => {
                    res.write(`data: ${JSON.stringify(event)}\n\n`);
                });
            } catch (err) {
                console.error("Error parsing event", err);
            }
        }
    });
}

// Start consumer in background
startKafkaConsumer().catch(console.error);

module.exports = router;
