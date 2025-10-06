# 2025-09-29 - OpenAPI v3 draft prompt / AI response snapshot

## Prompt
"Write an OpenAPI 3.0 spec for a Product Management REST API with endpoints POST /products, GET /products, PUT /products/{id}, DELETE /products/{id} and an SSE endpoint /events/stream. Include Product schema with id,name,description,price,quantity,category and a ProductCreate schema. Use JWT bearer auth. Keep it minimal."

## AI Response (abridged)
- Provided an OpenAPI 3.0.3 spec including components, schemas, paths for all endpoints and SSE streaming type.

## Human in the loop
- I removed advanced examples in the AI output (pagination details and excessive examples) to keep spec readable.
- I added `version` field to Product for optimistic concurrency.
- I added `sellerId` query param to GET /products to scope results to a seller.
- Verified schema fields against DB migration before committing.

## Notes
- commit: "Add openapi.yaml — generated with AI, validated and adjusted (Human in loop)."
