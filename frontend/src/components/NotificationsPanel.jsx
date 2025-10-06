import React from 'react';

export default function NotificationsPanel({ notifications }) {
    return (
        <div style={{ flex: 1, border: "1px solid gray", padding: "1rem" }}>
            <h3>Notifications</h3>
            {notifications.length === 0 && <p>No alerts yet</p>}
            <ul>
                {notifications.map((n, idx) => (
                    <li key={idx}>
                        ⚠ Low stock: {n.name} (qty={n.quantity}, threshold={n.threshold})
                    </li>
                ))}
            </ul>
        </div>
    );
}
