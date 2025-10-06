import React, { useState } from 'react';

const API_BASE = "http://localhost:8080";

export default function ProductModal({ product, onClose }) {
    const [form, setForm] = useState(product || { name: "", description: "", price: 0, quantity: 0, category: "" });

    async function save() {
        if (product) {
            await fetch(`${API_BASE}/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
        } else {
            console.log(form)
            await fetch(`${API_BASE}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...form, seller_id: "seller-1", price: parseFloat(form.price), quantity: parseFloat(form.price) })
            });
        }
        onClose();
    }

    return (
        <div style={{ border: "1px solid black", padding: "1rem", background: "#eee" }}>
            <h3>{product ? "Edit Product" : "Add Product"}</h3>
            {["name", "description", "price", "quantity", "category"].map(field => (
                <div key={field}>
                    <label>{field}:</label>
                    <input
                        type={field === "price" || field === "quantity" ? "number" : "text"}
                        value={form[field]}
                        onChange={e => setForm({ ...form, [field]: e.target.value })}
                    />
                </div>
            ))}
            <button onClick={save}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}
