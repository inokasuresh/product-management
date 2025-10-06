const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const Publisher = require('../publishers/publisher');
const inMemoryPublisher = require('../publishers/inMemoryPublisher');

const router = express.Router();

const publisher = process.env.USE_KAFKA === 'true' ? require('../publishers/kafkaPublisher') : inMemoryPublisher;

/**
 * POST /products
 * Body: { name, description, price, quantity, category, seller_id (optional for local dev) }
 */
router.post('/', async (req, res, next) => {
    try {
        const { name, description = '', price, quantity, category, seller_id } = req.body;

        if (!name || typeof price !== 'number' || typeof quantity !== 'number' || !category) {
            return res.status(400).json({ message: 'name, price(number), quantity(number), category required' });
        }

        const sellerId = seller_id || req.header('X-Seller-Id') || 'seller-local';
        const id = uuidv4();
        const version = 1;
        const now = new Date();

        const product = {
            id,
            seller_id: sellerId,
            name,
            description,
            price,
            quantity,
            category,
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            version
        };

        // Insert into DB
        await db.query(
            `INSERT INTO products (id, seller_id, name, description, price, quantity, category, created_at, updated_at, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [product.id, product.seller_id, product.name, product.description, product.price, product.quantity, product.category, product.created_at, product.updated_at, product.version]
        );

        // Build event
        const event = {
            event_id: uuidv4(),
            event_type: 'ProductCreated',
            occurred_at: new Date().toISOString(),
            seller_id: sellerId,
            payload: {
                ...product
            }
        };

        // publish (in-memory or kafka stub)
        await publisher.publish(event);

        // Return created product
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
});


// GET /products?sellerId=...
router.get('/', async (req, res, next) => {
    try {
        const sellerId = req.query.sellerId || 'seller-local';
        const { rows } = await db.query('SELECT * FROM products WHERE seller_id=$1', [sellerId]);
        res.json(rows);
    } catch (err) {
        console.log('#####')
        next(err);
    }
});

// PUT /products/:id
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity, category } = req.body;
        const now = new Date();

        const { rows } = await db.query(
            `UPDATE products SET name=$1, description=$2, price=$3, quantity=$4, category=$5, updated_at=$6, version=version+1
       WHERE id=$7 RETURNING *`,
            [name, description, price, quantity, category, now.toISOString(), id]
        );

        if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
        const product = rows[0];

        const event = {
            event_id: require('uuid').v4(),
            event_type: 'ProductUpdated',
            occurred_at: new Date().toISOString(),
            seller_id: product.seller_id,
            payload: product
        };
        await publisher.publish(event);

        if (product.quantity < (process.env.LOW_STOCK_THRESHOLD || 5)) {
            const lowStock = {
                event_id: require('uuid').v4(),
                event_type: 'LowStockWarning',
                occurred_at: new Date().toISOString(),
                seller_id: product.seller_id,
                payload: {
                    product_id: product.id,
                    name: product.name,
                    quantity: product.quantity,
                    threshold: parseInt(process.env.LOW_STOCK_THRESHOLD || 5)
                }
            };
            await publisher.publish(lowStock);
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
});

// DELETE /products/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Not found' });

        const event = {
            event_id: require('uuid').v4(),
            event_type: 'ProductDeleted',
            occurred_at: new Date().toISOString(),
            seller_id: rows[0].seller_id,
            payload: { id, version: rows[0].version }
        };
        await publisher.publish(event);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;



