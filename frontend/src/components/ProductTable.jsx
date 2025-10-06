import React from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:8080";

export default function ProductTable({ products, onEdit, onDelete }) {
    async function handleDelete(id) {
        await axios.delete(`${API_BASE}/products/${id}`);
        onDelete();
    }

    return (
        <table border="1" cellPadding="6">
            <thead>
            <tr>
                <th>Name</th><th>Price</th><th>Qty</th><th>Category</th><th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map(p => (
                <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>{p.quantity}</td>
                    <td>{p.category}</td>
                    <td>
                        <button onClick={() => onEdit(p)}>Edit</button>
                        <button onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
