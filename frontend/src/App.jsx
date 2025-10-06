import React, { useEffect, useState } from 'react';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import NotificationsPanel from './components/NotificationsPanel';
import axios from 'axios';

const API_BASE = "http://localhost:8080";

export default function App() {
    const [products, setProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [notifications, setNotifications] = useState([]);

    async function fetchProducts() {
        const resp = await axios.get(`${API_BASE}/products?sellerId=seller-1`);
        setProducts(resp.data);
    }

    function openModal(product) {
        setEditing(product || null);
        setModalOpen(true);
    }

    useEffect(() => {
        fetchProducts();
        // SSE connection
        const evtSource = new EventSource(`http://localhost:8080/events/stream?sellerId=seller-1`);
        evtSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.event_type === "LowStockWarning") {
                setNotifications((prev) => [...prev, data.payload]);
            }
        };
        return () => evtSource.close();
    }, []);

    return (
        <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 3 }}>
                <button onClick={() => openModal(null)}>Add Product</button>
                <ProductTable products={products} onEdit={openModal} onDelete={fetchProducts} />
            </div>
            <NotificationsPanel notifications={notifications} />
            {modalOpen && (
                <ProductModal
                    product={editing}
                    onClose={() => { setModalOpen(false); fetchProducts(); }}
                />
            )}
        </div>
    );
}
