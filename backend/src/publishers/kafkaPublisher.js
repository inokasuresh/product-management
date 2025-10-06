// module.exports = {
//     async publish(event) {
//         // TODO: implement Kafka publishing using kafkajs
//         console.log('[kafkaPublisher] stub publish', event.event_type, event.event_id);
//         return Promise.resolve();
//     }
// };

const { Kafka } = require('kafkajs');

let producer;

async function getProducer() {
    if (!producer) {
        // const kafka = new Kafka({ brokers: ['localhost:9092'] });
        const kafka = new Kafka({ brokers: (process.env.KAFKA_BROKERS || 'kafka:9092').split(',') });
        producer = kafka.producer();
        await producer.connect();
    }
    return producer;
}

module.exports = {
    async publish(event) {
        const p = await getProducer();
        await p.send({
            topic: event.event_type,
            messages: [{ key: event.seller_id, value: JSON.stringify(event) }]
        });
        console.log('[KafkaPublisher] published', event.event_type, event.event_id);
    }
};
