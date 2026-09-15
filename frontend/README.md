# TravelBooking Console (Frontend — Stage 1)

React + Vite frontend for the existing Spring Boot Travel Booking backend.
This is **stage 1 only**: project setup, layout, and the dashboard. The six
module pages (Flights, Pricing, Cancellation, Recommendations, Booking,
Reviews, Admin) currently show a "coming soon" placeholder and will be built
one at a time in the next stages.

## Prerequisites

- Node.js 18+ and npm
- The Spring Boot backend running locally on port **8088** (see the backend's
  own README for how to start it) — the CORS config now allows
  `http://localhost:5173`.

## Setup

```
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

## Configuration

The backend URL is read from an environment variable, not hardcoded:

```
# .env
VITE_API_BASE_URL=http://localhost:8088
```

`.env` is git-ignored; `.env.example` shows the expected shape so it's easy to
point at a deployed backend URL later without touching any code.

## What's included in this stage

- Vite + React 18 (JavaScript, no TypeScript)
- `react-router-dom` for page navigation
- `src/api/client.js` — single fetch wrapper all future API modules will use,
  with friendly messages for network failures, 400s, 404s, and 500s
- `src/api/useBackendStatus.js` — a real connectivity check (calls the actual
  `/flight/list` endpoint) shown as the "Backend connected / unreachable" pill
  in the header
- Sidebar + header layout, used by every page via `PageLayout`
- Shared `LoadingState`, `ErrorState`, `EmptyState`, `SuccessMessage`
  components for consistent states across all module pages
- Dashboard home page introducing the project and linking to all 7 sections
  (6 tasks + Admin as its own page)

## Known backend limitations reflected in this UI

Flight status/notifications are simulated, pricing is rule-based for three
sample flight numbers, and seats/rooms/price-freeze/cancellation/refund/user
preference data live in memory on the backend (reset on server restart), not
in the database. Room preview links are placeholder URLs, not real images.
The recommendation engine is rule-based, not machine learning. Admin login is
the existing basic implementation, not production-grade authentication. Pages
will call this out directly where relevant as they're built.
