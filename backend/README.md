# Clinic Backend

Feature-based Express + TypeScript + MongoDB backend. Auth keeps the original cookie/JWT approach; clinic admin is the only authenticated role in the MVP. Doctors and patients are clinic-owned records.

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Environment
- NODE_ENV
- PORT
- MONGO_URI
- JWT_SECRET
- FRONTEND_URL
- COOKIE_DOMAIN (optional)

## Public booking
`/booking/:clinicSlug` and its doctor/slot/appointment endpoints do not require authentication.
