const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const eventsRouter = require('./routes/events');
const cors = require('cors');

// let corsOptions = {
//     origin : ['http://localhost:3000'],
// }

function createApp() {
    const app = express();
    // app.use(cors());
    app.use(bodyParser.json());

    app.use(cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'], // add both if needed
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.get('/', (req, res) => res.json({ status: 'ok' }));

    app.use('/products', productsRouter);

    // simple error handler
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(err.status || 500).json({ message: err.message || 'internal error' });
    });

    app.use('/events', eventsRouter);

    return app;
}

module.exports = createApp();
