# 2025-09-30 - React Frontend Scaffold Prompt / AI Response Snapshot

## Prompt
"Scaffold a minimal React (Vite) frontend for the product dashboard.
- Products table with Add/Edit/Delete actions calling backend APIs.
- Modal for product create/edit.
- SSE client to /events/stream for LowStockWarning notifications.
  Keep it minimal and functional."

## AI Response (abridged)
- Created React app structure with Vite.
- Added App.jsx, ProductTable.jsx, ProductModal.jsx, NotificationsPanel.jsx.
- Added axios calls to backend CRUD endpoints.
- Connected EventSource to `/events/stream?sellerId=...`.

## Human in the loop
- Hardcoded `seller-1` for demo simplicity.
- Added simple inline styles and barebones UI instead of external CSS.
- Ensured modal refreshes product list on close.

## Notes
- commit: "Scaffold frontend (React + Vite) with product CRUD and notifications panel (AI generated, human adjusted)."
