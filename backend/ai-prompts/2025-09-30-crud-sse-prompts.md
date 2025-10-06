# 2025-09-30 - CRUD + SSE Extension Prompt / AI Response Snapshot

## Prompt
"Extend my backend so it supports GET /products, PUT /products/{id}, DELETE /products/{id},
and add an SSE endpoint /events/stream to push LowStockWarning events to the frontend in near real-time."

## AI Response (abridged)
- Provided GET route: fetch seller’s products by sellerId.
- Provided PUT route: updates product, emits ProductUpdated event, emits LowStockWarning event if quantity < threshold.
- Provided DELETE route: removes product, emits ProductDeleted event.
- Provided /events/stream router using Server-Sent Events (SSE) that broadcasts LowStockWarning events to connected clients.

## Human in the loop
- Adjusted PUT route to increment `version` automatically in SQL.
- Added environment variable `LOW_STOCK_THRESHOLD` with fallback 5.
- Ensured subscribers are scoped by `seller_id` in SSE router.
- Integrated SSE router into `server.js`.

## Notes
- commit: "Add GET, PUT, DELETE product routes and SSE notifications stream (AI generated, human validated)."
