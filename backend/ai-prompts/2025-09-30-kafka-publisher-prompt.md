# 2025-09-30 - Kafka Publisher Prompt / AI Response Snapshot

## Prompt
"Implement a Kafka publisher in Node.js (using kafkajs) for publishing events to Kafka topics.
Each event should be published to a topic named after the event_type, with seller_id as the message key."

## AI Response (abridged)
- Implemented kafkaPublisher.js using kafkajs.
- Lazy-connect producer on first publish.
- Publishes messages with key = seller_id, value = JSON string of event.

## Human in the loop
- Wrapped producer in getProducer() to ensure reuse.
- Logged published event type + id for debugging.
- Left TODO: add docker-compose services for Kafka (Zookeeper + broker).

## Notes
- commit: "Add Kafka publisher (stub for local dev, to be wired with docker-compose)."
