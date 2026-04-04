# Ride Sharing Full Feature — VIConnect

## Overview
Build: Post Ride, Live Dashboard rides, Request/Inbox system, Approve/Deny flow, and Chat.

## Backend (New Files)
- `server/models/Ride.js` — from, destination, date, time, fare, genderCategory, seats, createdBy
- `server/models/RideRequest.js` — ride ref, requestedBy ref, status (pending/approved/denied)
- `server/models/Message.js` — request ref, sender ref, text
- `server/routes/rides.js` — POST /api/rides, GET /api/rides
- `server/routes/requests.js` — POST /api/requests, GET /api/requests/inbox, PATCH /api/requests/:id
- `server/routes/messages.js` — GET /api/messages/:requestId, POST /api/messages/:requestId
- Update `server/models/User.js` — add gender field
- Update `server/routes/auth.js` — include gender in JWT
- Update `server/index.js` — register new routes

## Frontend (New Files)
- `src/components/Sidebar.jsx` — shared sidebar used by all pages
- `src/pages/PostRide.jsx` — form: from, destination, date, time, fare, seats, gender category
- `src/pages/Inbox.jsx` — two panels: list (received/sent tabs) + detail (approve/deny or chat)

## Frontend (Modified)
- `src/pages/Register.jsx` — add gender field (male/female)
- `src/pages/Dashboard.jsx` — fetch real rides, no dummy data, gender check, request button, inbox preview
- `src/App.jsx` — add /post-ride and /inbox routes

## Key Logic
- Gender check server-side: if ride.genderCategory != 'both' and user.gender doesn't match → reject
- Dashboard shows "Your Ride" badge for own rides (no request button)
- Chat is enabled only when request status = approved
- Chat polls every 2s when viewing an approved conversation
