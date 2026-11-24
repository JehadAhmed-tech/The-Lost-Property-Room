# The Lost Property Room — React Frontend

A responsive React + Vite frontend for the SE 331 Lost & Found live coding assessment.

## Features
- Dashboard with report statistics and recent activity
- Create and browse Lost Reports
- Create and browse Found Reports
- Match Center with manual Confirm / Reject review
- Notifications
- Handover tracking and Returned status
- Report History and 30-day expiry view
- Demo mode with local browser storage
- Axios API service ready for backend integration

## Run locally
1. Install Node.js (LTS).
2. Extract this ZIP.
3. Open the extracted folder in VS Code.
4. Open Terminal in this folder and run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite, usually http://localhost:5173.

## Backend connection
By default, the app runs in demo mode and stores data in the browser's localStorage.

When your teammate's backend is ready:
1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to the backend API base URL.
3. Set `VITE_USE_MOCK=false`.
4. Restart `npm run dev`.

The API endpoints and payloads are documented in `BACKEND_API.md`. Confirm exact route names and response shapes with your backend teammate before connecting.

## Important
Demo mode is for frontend development only. It does not replace the backend database, authentication, or server-side matching. The system only suggests possible matches; Mr. Alam must manually confirm or reject them. No item is automatically handed over.
