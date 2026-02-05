# Community Helpers Explorer Backend

This is the Express.js backend for the Community Helpers Explorer MERN app.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file with your MongoDB URI (already provided).
3. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints
- `GET /api/helpers` — List all helpers
- `POST /api/progress` — Save user progress (stars earned)
