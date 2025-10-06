# Product Management - Backend (minimal demo)

## Requirements
- Node 18+
- npm
- Postgres (if not using mock)

## Quick local dev (fast)
1. Copy .env.example -> .env and update DATABASE_URL if you run Postgres locally.
2. Install:
   npm install
3. Create DB & run migrations:
   # If you have Postgres running (default connection in .env.example)
   node -e "require('./src/db').runMigrations().then(()=>process.exit())"
4. Start app:
   npm run dev
5. POST a product:
   curl -X POST http://localhost:8080/products \
   -H "Content-Type: application/json" \
   -d '{"name":"T-shirt","description":"Cotton","price":19.9,"quantity":10,"category":"apparel","seller_id":"seller-1"}'

## Tests
npm test

## Notes
- By default, publisher is in-memory (no Kafka). Set USE_KAFKA=true to use kafkaPublisher stub (no real effect until implemented).
- The code uses JWT auth in the OpenAPI spec. For the demo we accept X-Seller-Id header or `seller_id` field.
- Next steps to complete full challenge:
    - Implement GET/PUT/DELETE with optimistic concurrency checks and low-stock event emission on update.
    - Implement SSE endpoint (notifications service) to stream low-stock warnings to frontend.
    - Add Kafka publisher via kafkajs and a notifications consumer.
    - Add clustering (cluster or PM2), worker threads for analytics, and stream import/export endpoints.
