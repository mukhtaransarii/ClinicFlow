# ClinicFlow Frontend

ClinicFlow is a React + TypeScript clinic-management frontend. It uses Vite, Tailwind CSS v4, React Router, and Zustand. UI components are local TSX components; there is no shadcn or component-library dependency.

## Requirements

- Node.js compatible with the Vite version in `package.json`
- The ClinicFlow backend running locally, or a deployed backend URL
- A MongoDB connection configured by the backend

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` in the project root:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

   Set `VITE_API_URL` to your deployed backend URL when not running locally. Do not add a trailing slash.

3. Start the frontend:

   ```bash
   npm run dev
   ```

4. Open the URL printed by Vite. Build for production with `npm run build`; preview the production build with `npm run preview`.

The backend must allow the frontend origin through CORS and credentials. The frontend sends requests with `credentials: "include"` because authentication uses an HTTP-only cookie.

## Important files

| File | Responsibility |
| --- | --- |
| `src/main.tsx` | React entry point and router setup |
| `src/App.tsx` | Route definitions and initial session check |
| `src/lib/api.ts` | Shared fetch helper, API base URL, cookie credentials, API errors |
| `src/stores/authStore.ts` | Zustand auth state: signup, login, session restore, logout |
| `src/stores/clinicStore.ts` | Zustand clinic profile state and updates |
| `src/stores/dataStore.ts` | Zustand doctors, patients, appointments and API actions |
| `src/components/layout/ProtectedRoute.tsx` | Blocks dashboard routes when not authenticated |
| `src/components/layout/AppLayout.tsx` | Shared authenticated page shell |
| `src/components/layout/Sidebar.tsx` | Dashboard navigation |
| `src/components/layout/Header.tsx` | Authenticated header/actions |
| `src/components/ui/` | Reusable Button, Input, Card, Badge, Modal and Empty components |
| `src/pages/auth/` | Login and signup screens |
| `src/pages/dashboard/Dashboard.tsx` | Clinic overview and summary counts |
| `src/pages/appointments/Appointments.tsx` | Appointment list, status filters, create and confirm actions |
| `src/pages/doctors/Doctors.tsx` | Doctor list and create-doctor form |
| `src/pages/patients/Patients.tsx` | Patient list |
| `src/pages/calendar/Calendar.tsx` | Calendar view |
| `src/pages/schedules/Schedules.tsx` | Doctor availability schedules |
| `src/pages/notifications/Notifications.tsx` | Notification screen |
| `src/pages/settings/Settings.tsx` | Clinic settings |
| `src/pages/booking/Booking.tsx` | Public patient booking form; no patient login required |

## Routes and user roles

| Route | Who uses it | Purpose |
| --- | --- | --- |
| `/` | Anyone | Public landing page |
| `/signup` | Clinic owner/admin | Creates the clinic admin account and clinic |
| `/login` | Clinic owner/admin | Signs in |
| `/dashboard` | Signed-in clinic admin | Overview of clinic activity |
| `/appointments` | Signed-in clinic admin | View, filter, create, and confirm appointments |
| `/calendar` | Signed-in clinic admin | View appointments in calendar form |
| `/doctors` | Signed-in clinic admin | Add and view doctors |
| `/patients` | Signed-in clinic admin | View patients registered through booking |
| `/schedules` | Signed-in clinic admin | Manage doctor availability |
| `/notifications` | Signed-in clinic admin | View clinic notifications |
| `/settings` | Signed-in clinic admin | View/update clinic settings |
| `/booking/:clinicSlug` | Patient / public visitor | Submit a booking request for a clinic; no account required |

**Role model in this frontend:** the authenticated dashboard is for the clinic owner/admin. Doctors are clinic records, not separate authenticated users in this MVP. Patients do not sign in; they use the public booking page. The backend currently creates a patient record as part of public booking.

## Buttons and API calls

All API calls go through `src/lib/api.ts`. The base URL is `VITE_API_URL`, and requests include cookies.

| Screen / action | Frontend file | API call | Result / who sees it |
| --- | --- | --- | --- |
| Restore login on app startup | `src/App.tsx`, `src/stores/authStore.ts` | `GET /auth/me` | Restores the clinic admin session; protected pages are then available |
| Sign up | `src/pages/auth/Signup.tsx`, `src/stores/authStore.ts` | `POST /auth/signup` | Creates the admin and clinic, then signs the admin in |
| Sign in | `src/pages/auth/Login.tsx`, `src/stores/authStore.ts` | `POST /auth/login` | Sets the auth cookie and opens the dashboard |
| Log out | `src/components/layout/Header.tsx`, `src/stores/authStore.ts` | `GET /auth/logout` | Clears the session and returns to public/auth screens |
| Load clinic profile | `src/stores/clinicStore.ts` | `GET /clinics/me` | Admin sees their clinic profile |
| Save clinic settings | `src/stores/clinicStore.ts` | `PATCH /clinics/me` | Updates the clinic profile for that clinic |
| Load doctors | `src/stores/dataStore.ts` | `GET /doctors` | Admin sees doctors belonging to their clinic; appointment form uses this list |
| Add doctor | `src/pages/doctors/Doctors.tsx`, `src/stores/dataStore.ts` | `POST /doctors` | Adds a doctor to the signed-in admin's clinic |
| Update doctor | `src/stores/dataStore.ts` | `PATCH /doctors/:id` | Updates a clinic doctor |
| Load patients | `src/stores/dataStore.ts` | `GET /patients` | Admin sees patients belonging to their clinic |
| Load appointments | `src/stores/dataStore.ts` | `GET /appointments` | Admin sees appointments for their clinic |
| Create appointment from admin | `src/pages/appointments/Appointments.tsx`, `src/stores/dataStore.ts` | `POST /appointments` | Creates an appointment for a selected existing patient and active doctor |
| Confirm appointment | `src/pages/appointments/Appointments.tsx`, `src/stores/dataStore.ts` | `PATCH /appointments/:id` | Changes the appointment status to `CONFIRMED` |
| Public clinic details | `src/pages/booking/Booking.tsx` | `GET /booking/:clinicSlug` | Public booking page displays clinic details |
| Public doctor list | `src/pages/booking/Booking.tsx` | `GET /booking/:clinicSlug/doctors` | Patient chooses a doctor |
| Fetch available time slots | `src/pages/booking/Booking.tsx` | `GET /booking/:clinicSlug/slots?doctorId=...&date=...` | Patient chooses an available slot |
| Submit public booking | `src/pages/booking/Booking.tsx` | `POST /booking/:clinicSlug/appointments` | Creates a booking/patient record; clinic admin can see the appointment in the dashboard |
| Load schedules | `src/pages/schedules/Schedules.tsx` | `GET /schedules` | Admin sees doctor schedules |
| Create/update/delete schedule | `src/pages/schedules/Schedules.tsx` | `POST /schedules`, `PATCH /schedules/:id`, `DELETE /schedules/:id` | Changes doctor availability |
| Load notifications | `src/pages/notifications/Notifications.tsx` | `GET /notifications` | Admin sees notifications, if returned by the backend |
| Mark notification read | `src/pages/notifications/Notifications.tsx` | `PATCH /notifications/:id/read` | Marks that notification as read |

## Admin-created appointment requirements

The backend's `POST /appointments` expects:

```json
{
  "doctorId": "<doctor MongoDB ID>",
  "patientId": "<patient MongoDB ID>",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "purpose": "Reason for visit"
}
```

The selected doctor must be active and have a schedule covering the requested time. The slot must not already be booked. The patient must already exist in the clinic. In the current backend, patients are created by the public booking flow; there is no admin `POST /patients` endpoint yet. Therefore, if the patient dropdown is empty, first submit a booking through `/booking/:clinicSlug`, or add a patient-creation endpoint to the backend.

## Formatting and checks

Source files use readable, multi-line TypeScript/TSX. Run `npm run build` to run TypeScript checks and create a production build. Run `npm run lint` for Oxlint.
