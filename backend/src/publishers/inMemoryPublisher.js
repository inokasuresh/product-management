const events = [];

module.exports = {
    async publish(event) {
        // simple at-least-once semantics simulation:
        events.push(event);
        console.log('[inMemoryPublisher] published event:', event.event_type, event.event_id);
        return Promise.resolve();
    },
    getEvents() {
        return events;
    },
    clear() {
        events.length = 0;
    }
};
