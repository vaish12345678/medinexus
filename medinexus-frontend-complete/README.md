# Medinexus Frontend — Complete UI

This is the full React/Vite frontend for the Medinexus Spring Boot backend. It includes separate patient, doctor, pharmacy, hospital and admin screens and uses the backend endpoints supplied in the project.

## Run

1. Start the backend on `http://localhost:8081`.
2. In this folder run:

```bash
npm install
npm run dev
```

3. Open `http://localhost:5173`.

The Vite proxy forwards `/api` to the backend, so no frontend CORS configuration is required for local development.

## Environment

Optional `.env`:

```env
VITE_API_URL=/api
```

## Important

The frontend does not invent an ambulance booking flow. It only calls the backend nearby-ambulance endpoint. Hospital departments/doctors/beds are placed under the admin UI because the supplied backend authorizes those management endpoints for ADMIN. The doctor search screen uses hospital doctor endpoints because the supplied backend has no `/api/doctors/search` controller.
