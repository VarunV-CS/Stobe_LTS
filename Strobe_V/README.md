# STROBE

STROBE is a recruitment operations dashboard built as a React frontend with a separate Express/MongoDB backend in [`../APIS`](../APIS). The product is centered around candidate tracking, dashboard reporting, resume/document handling, and lightweight internal admin workflows.

## What This Repository Contains

This workspace is split into two apps:

- `cestasoft-strobe-369d4ed6bffd/`: Vite + React frontend
- `APIS/`: Express + MongoDB backend API

The frontend is the main user-facing application. It stores the signed-in user in local storage, protects internal pages, and talks to the backend through `VITE_API_BASE_URL` or `http://localhost:5001`.

## Implemented Product Features

### Authentication and session handling

- Sign-in form with `react-hook-form` + `zod` validation
- User authentication against `POST /users/signin`
- Auth state persisted in local storage through `AuthContext`
- Protected application routes behind `ProtectedRoute`
- User popover with profile navigation and sign-out

### Dashboard

- Summary cards for:
  - active candidates
  - green candidates
  - amber candidates
  - candidates added in the last 30 days
- Bar charts for:
  - candidate status distribution
  - shortlisted vs rejected candidates
  - role counts
  - candidates per role
  - role-based green candidates
  - role-based amber candidates
- Automatic dashboard refresh every 5 minutes

### Candidate management

- Candidate list view with:
  - search
  - pagination
  - recent candidate count
  - export to Excel with `xlsx`
  - delete action
- Candidate creation form with:
  - personal/contact details
  - notice period
  - location and relocation
  - role and expected role
  - CTC/payment details
  - status and RAG fields
  - interview and communication fields
  - resume upload support
- Candidate edit form with:
  - full candidate detail fetch by ID
  - update/save flow
  - document upload flow
  - existing uploaded resume/document links
- Candidate activity logging on export through `POST /activity/create`

### Client and role administration

- Combined `Client And Roles` screen with tabs
- Client CRUD UI:
  - list
  - search
  - create
  - edit
  - delete
- Role CRUD UI:
  - list
  - search
  - create
  - edit
  - delete
  - assign one role to one or more clients
  - track location, tech stack, dates, status, and experience

### Template / resume processing screen

- Upload a file and send it to a resume-processing endpoint
- Show formatted output in a dialog

### Profile UI

- Profile page showing current signed-in user details
- Editable first name, last name, and password fields in the UI

### Backend API modules

- User signup/signin/password update/update user
- Candidate create, fetch, update, delete, bulk upload, status counts, role counts, and resume uploads
- Employee create, fetch, update, and document generation/upload
- Activity creation/logging
- Daily cron job to email candidates older than 30 days when enabled

## Frontend Routes

The frontend defines these primary routes:

| Route                | Purpose                    |
| -------------------- | -------------------------- |
| `/`                  | Sign-in page               |
| `/dashboard`         | Dashboard and charting     |
| `/candidates`        | Candidate list             |
| `/candidates/create` | Create candidate           |
| `/candidates/:id`    | Edit candidate             |
| `/profile`           | User profile               |
| `/ClientRoles`       | Clients and roles admin    |
| `/Template`          | Resume/template processing |

## Backend Route Groups

The Express app mounts:

- `/users`
- `/candidates`
- `/activity`
- `/employee`

Important implemented endpoints include:

### Users

- `POST /users/signup`
- `POST /users/signin`
- `PATCH /users/updatePassword`
- `PATCH /users/updateForgotPassword/:_id`
- `PATCH /users/updateUser/:_id`

### Candidates

- `POST /candidates/create`
- `POST /candidates/create1`
- `POST /candidates/bulkUpload`
- `GET /candidates/get`
- `GET /candidates/get1`
- `GET /candidates/getTable`
- `GET /candidates/getById/:id`
- `PATCH /candidates/update/:_id`
- `PATCH /candidates/update1/:_id`
- `PATCH /candidates/updateDoc/:_id`
- `GET /candidates/getStatusCount`
- `GET /candidates/getRoleCount`
- `DELETE /candidates/deleteById/:id`

### Activity

- `POST /activity/create`

### Employee

- `POST /employee/create`
- `GET /employee/get`
- `GET /employee/getById/:id`
- `PATCH /employee/update/:_id`
- `POST /employee/updateDoc`
- `POST /employee/uploadindependentDocument`

## Data and Integrations

### Database

- MongoDB via Mongoose
- Main DB name: `CestaIntra`

### Storage

- Candidate files are uploaded with `multer`
- Resume files are sent to a DigitalOcean Spaces / S3-compatible bucket
- Allowed file types: PDF, DOC, DOCX
- Max file size: `5MB`

### Document generation

- Employee document flows use `docxtemplater` + `pizzip`
- Additional upload/generation helpers exist in backend middleware files

### Background jobs

- Optional daily cron job checks candidates created more than 30 days ago
- Sends email reminders with `nodemailer` when `ENABLE_CRON=true`

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- MUI
- ApexCharts and Recharts
- Axios
- React Hook Form
- Zod
- Day.js
- `xlsx`

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Bcrypt
- Multer
- AWS SDK
- Nodemailer
- Node-cron
- Docxtemplater

## Local Development

### Frontend

```bash
cd cestasoft-strobe-369d4ed6bffd
npm install
npm run dev
```

Optional environment variable:

```bash
VITE_API_BASE_URL=http://localhost:5001
```

### Backend

```bash
cd APIS
npm install
npm start
```

Useful backend environment variables:

```bash
PORT=5001
NODE_ENV=development
MONGODB_URI=<your-mongodb-uri>
ENABLE_CRON=false
SMTP_HOST=smtp.gmail.com
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-password>
MAIL_FROM=<from-address>
MAIL_TO=<recipient>
MAIL_CC=<cc-recipient>
```

## Folder Overview

```text
STROBE/
├── APIS/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── README.md
└── cestasoft-strobe-369d4ed6bffd/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── core/
    │   ├── layouts/
    │   ├── pages/
    │   └── styles/
    ├── package.json
    └── vite.config.js
```

## Current Integration Notes

While documenting the codebase, a few frontend integrations were found that are referenced by the UI but are not implemented inside the `APIS` service in this workspace snapshot:

- `/client/*`
- `/roles/*`
- `/resume/process-resume`
- `/candidates/dashboard`
- `/candidates/import`

That means the frontend is designed for a broader backend surface area than the API code currently present here. If those endpoints exist in another service or branch, the UI is already wired for them.

## Known Implementation Notes

- `APIS/README.md` already contains backend-focused endpoint documentation.
- The profile page currently updates local form state only; it does not call the backend update endpoint yet.
- The forgot-password route exists in the backend, but its controller logic is currently commented out.
- There are no automated tests configured in either app.

## Scripts

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

### Backend

- `npm start`
- `npm run serverProd`

## Deployment

- Frontend is a Vite build output in `dist/`
- Backend includes [`vercel.json`](../APIS/vercel.json) for Vercel serverless deployment of `app.js`
