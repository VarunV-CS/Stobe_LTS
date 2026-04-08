# APIS

Backend API for the STROBE/Cesta internal system. This service is built with Express and MongoDB and currently provides modules for:

- User authentication and profile updates
- Candidate creation, bulk import, resume uploads, and reporting
- Employee record management
- Contract document generation and upload
- Activity logging
- Daily candidate-age email reminders

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- `multer` for multipart file uploads
- DigitalOcean Spaces / S3-compatible storage for resumes and generated documents
- `docxtemplater` + `pizzip` for DOCX generation
- `axios` + ApyHub for DOCX to PDF conversion
- `node-cron` + `nodemailer` for scheduled reminder emails

## Project Structure

```text
APIS/
├── app.js
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── package.json
└── vercel.json
```

## Base URL and Routing

The app mounts these route groups:

- `/users`
- `/candidates`
- `/activity`
- `/employee`

Default local port:

```bash
5001
```

Example local base URL:

```text
http://localhost:5001
```

## Setup

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

## Environment Variables

The code currently supports the following environment variables:

| Variable      | Purpose                                                         |
| ------------- | --------------------------------------------------------------- |
| `PORT`        | Port for local HTTP server. Defaults to `5001`.                 |
| `NODE_ENV`    | Switches between development and production DB config.          |
| `MONGODB_URI` | Overrides the hardcoded MongoDB Atlas connection string.        |
| `VERCEL`      | Prevents local `httpServer.listen()` when deployed on Vercel.   |
| `ENABLE_CRON` | Set to `true` to enable the daily candidate-age email job.      |
| `SMTP_HOST`   | SMTP host for cron email sending. Defaults to `smtp.gmail.com`. |
| `SMTP_USER`   | SMTP username.                                                  |
| `SMTP_PASS`   | SMTP password/app password.                                     |
| `MAIL_FROM`   | Optional sender email. Falls back to `SMTP_USER`.               |
| `MAIL_TO`     | Primary recipient for candidate reminder emails.                |
| `MAIL_CC`     | Optional CC recipient(s) for reminder emails.                   |

## Authentication

JWT auth is implemented in [`middleware/auth.js`](./middleware/auth.js).

- Secret: `CESTA`
- Tokens are accepted from:
  - `Authorization: Bearer <token>`
  - `req.query.token`
- Protected routes currently in use:
  - `PATCH /users/updateForgotPassword/:_id`

Notes:

- `POST /users/signin` issues a token valid for `10m`
- `POST /users/signup` issues a token valid for `50m`
- Several routes import the auth middleware but do not currently enforce it

## File Upload Rules

Candidate resume uploads use [`middleware/upload.js`](./middleware/upload.js).

- Field name: `files`
- Multiple files are allowed
- Accepted MIME types:
  - PDF
  - DOC
  - DOCX
- Max file size: `5MB` per file
- Uploaded files are stored in DigitalOcean Spaces and saved as public URLs in candidate `resume`

## Data Models

### User

Fields in [`models/users.js`](./models/users.js):

- `FirstName`
- `LastName`
- `phoneNumber`
- `email`
- `password` (bcrypt hashed)

### Candidate

Fields in [`models/candidates.js`](./models/candidates.js):

- `candidateID`
- `name`
- `surName`
- `contactNo`
- `alternateContactNo`
- `email`
- `experience`
- `noticePeriod`
- `currentLocation`
- `screenedBy`
- `workingModel`
- `currentRole`
- `expectedRole`
- `relocate`
- `currency`
- `currentCTC`
- `expectedCTC`
- `paymentType`
- `interviewer`
- `status`
- `screeningNotes`
- `screeningOutcome`
- `internalInterviewNotes`
- `internalRAG`
- `clientsInterviewDate`
- `clientFeedback`
- `lastComms`
- `createdBy`
- `resume`
- `createdAt`
- `updatedAt`

Important implementation note:

- There is also a legacy/alternate schema file at [`candidates.js`](./candidates.js) where `screeningNotes` and `internalInterviewNotes` are arrays. The active API imports [`models/candidates.js`](./models/candidates.js).

### Employee

Fields in [`models/employee.js`](./models/employee.js):

- `name`
- `contractType`
- `idNumber`
- `address`
- `jobTitle`
- `cDate`
- `remuniration`
- `sigAuth`
- `country`
- `endDate`
- `contract`
- `servicesDel`
- `registrationNumber`
- `postalAddress`
- `telNumber`
- `cellNumber`
- `email`
- `entityName`
- `createdAt`
- `updatedAt`

### Activity

Fields in [`models/activity.js`](./models/activity.js):

- `userID`
- `Activity`
- `userName`
- `createdAt`
- `updatedAt`

## API Endpoints

## Users

### `POST /users/signup`

Creates a new user account and returns a JWT.

Request body:

```json
{
  "FirstName": "John",
  "LastName": "Doe",
  "phoneNumber": 9876543210,
  "email": "john@example.com",
  "password": "plain-text-password"
}
```

Behavior:

- Rejects duplicate email with `400`
- Hashes password with bcrypt
- Returns created user plus token

### `POST /users/signin`

Authenticates a user and returns a JWT.

Request body:

```json
{
  "email": "john@example.com",
  "password": "plain-text-password"
}
```

Behavior:

- `404` if user does not exist
- `400` if password is invalid
- Returns `user` and `token`

### `POST /users/forgotPassword`

Currently not implemented.

Notes:

- Controller contains commented-out reset-link logic
- As of now this route does not return a working forgot-password flow

### `PATCH /users/updatePassword`

Updates password by validating the current password first.

Request body:

```json
{
  "email": "john@example.com",
  "password": "old-password",
  "newPassword": "new-password"
}
```

### `PATCH /users/updateForgotPassword/:_id`

Protected route used to directly set a new password by user id.

Headers:

```text
Authorization: Bearer <token>
```

Request body:

```json
{
  "password": "new-password"
}
```

### `PATCH /users/updateUser/:_id`

Updates any user fields passed in the request body.

Behavior:

- If `password` is included, it is re-hashed before saving
- Returns Mongo `updateOne` result, not the fully updated document

## Candidates

### `POST /candidates/create`

### `POST /candidates/create1`

Both routes currently call the same controller: `createCandidates1`.

Purpose:

- Create a candidate
- Optionally upload one or more resume files in the same request

Content type:

```text
multipart/form-data
```

Form fields commonly used:

```text
name
surName
contactNo
alternateContactNo
email
experience
noticePeriod
currentLocation
screenedBy
workingModel
currentRole
expectedRole
relocate
currency
currentCTC
expectedCTC
paymentType
interviewer
status
screeningNotes
screeningOutcome
internalInterviewNotes
internalRAG
clientsInterviewDate
clientFeedback
lastComms
createdBy
files
```

Behavior:

- Generates a random numeric `candidateID`
- Saves uploaded resume URLs into `resume`
- Returns the full created candidate document

Implementation note:

- The controller reads `surName`, but also destructures `lastName`; `surName` is the field actually saved for surname in current usage

### `POST /candidates/bulkUpload`

Bulk creates multiple candidates from an array payload.

Request body:

```json
[
  {
    "FirstName": "Jane",
    "LastName": "Smith",
    "ContactNumber": "9999999999",
    "AlternateContactNumber": "8888888888",
    "Experience": "5",
    "NoticePeriod": "30 Days",
    "CandidateEmailAddress": "jane@example.com",
    "CurrentLocation": "Bangalore",
    "ScreenedBy": "Recruiter A",
    "WorkingModel": "Remote",
    "CurrentRole": "Tester",
    "ExpectedRole": "Senior Tester",
    "WillingToRelocate": "Yes",
    "Currency": "INR",
    "CurrentCTC": "800000",
    "ExpectedCTC": "1000000",
    "PaymentModel": "Monthly",
    "Interviewer": "Manager A",
    "Status": "Shortlisted",
    "ScreeningNotes": "Strong communication",
    "ScreeningOutcome": "Positive",
    "InternalInterviewNotes": "Proceed",
    "InternalRAG": "Green",
    "ClientsInterviewDate": "2026-04-15T00:00:00.000Z",
    "ClientsFeedback": "Pending",
    "LastComms": []
  }
]
```

Behavior:

- Maps spreadsheet-style property names to candidate schema fields
- Creates all items in one operation

### `GET /candidates/get`

Returns candidates in a transformed/export-style shape.

Returned field style:

- `FirstName`
- `LastName`
- `ContactNumber`
- `CandidateEmailAddress`
- `CurrentRole`
- `Status`
- etc.

This is useful when the consumer expects human-readable/export keys rather than raw schema fields.

### `GET /candidates/get1`

Returns raw candidate documents directly from MongoDB.

Use this when the frontend needs the original stored structure including `_id`, timestamps, resume array, and other raw fields.

### `GET /candidates/getTable`

Returns a trimmed list intended for table/grid views.

Response items include:

- `Name`
- `createdAt`
- `currentRole`
- `currency`
- `expectedCTC`
- `paymentType`
- `status`
- `clientsInterviewDate`
- `internalRAG`
- `_id`
- `email`

### `GET /candidates/getById/:id`

Fetches a single candidate by Mongo `_id`.

### `PATCH /candidates/update/:_id`

Updates a candidate using the original update flow.

Behavior:

- If `screeningNotes` is present, it is removed from `$set` and pushed separately
- If `internalInterviewNotes` is present, it is removed from `$set` and pushed separately
- If both are present, both are pushed
- Otherwise, only a normal `$set` update is performed

Important note:

- In the active schema those fields are typed as strings, but this controller treats them like appendable collections. This route should be used carefully because the implementation behavior and schema shape are not perfectly aligned.

### `PATCH /candidates/update1/:_id`

Alternative update flow.

Behavior:

- Applies all request body fields via `$set`
- If `lastComms` is included, it replaces it with a normalized array of objects:
  - `message`
  - `createdBy`
  - `timeStamp`

Use this route when updating communication history or when the client already has the full intended `lastComms` array.

### `PATCH /candidates/updateDoc/:_id`

Uploads additional candidate documents/resumes and appends their URLs to `resume`.

Content type:

```text
multipart/form-data
```

Required file field:

```text
files
```

### `GET /candidates/getStatusCount`

Returns dashboard counts by status.

Current counters:

- `allCandidates`
- `shortlistedCandidates` where `status === "Shortlisted"`
- `rejectedCandidatesCount` where `status === "Reject"`

### `GET /candidates/getRoleCount`

Returns dashboard counts by role.

Current counters:

- `allCandidates`
- `testerCandidatesCount` where `currentRole === "Tester"`
- `developerCandidatesCount` where `currentRole === "developer"`

Important note:

- Role checks are currently case-sensitive and hardcoded

### `DELETE /candidates/deleteById/:id`

Deletes a candidate by Mongo `_id`.

## Employees

### `POST /employee/create`

Creates an employee/contract record.

Request body fields:

```json
{
  "contractType": "Hourly",
  "name": "Employee Name",
  "idNumber": "ID123",
  "address": "Address",
  "jobTitle": "Developer",
  "cDate": "2026-04-01T00:00:00.000Z",
  "remuniration": "500",
  "sigAuth": "Authorized Signatory",
  "country": "South Africa",
  "endDate": "2027-04-01T00:00:00.000Z",
  "contract": "Contract text/type",
  "registrationNumber": "REG123",
  "postalAddress": "Postal Address",
  "telNumber": "123456",
  "cellNumber": "999999",
  "servicesDel": "Service details",
  "email": "employee@example.com",
  "entityName": "Entity Name"
}
```

### `GET /employee/get`

Returns all employee records plus a computed `periods` field.

Computed field:

- `periods` is calculated from `cDate` to `endDate`
- Format example: `2 years and 34 days`

### `GET /employee/getById/:id`

Fetches one employee by Mongo `_id`.

### `PATCH /employee/update/:_id`

Updates an employee using the fields supplied in the request body.

### `POST /employee/updateDoc`

Generates an FTE contract document, uploads the generated DOCX and PDF, and returns their URLs.

Used template logic:

- If `contractType === "Hourly"`:
  - `middleware/Cetsasoft FTE Contract Hourly.docx`
- Otherwise:
  - `middleware/Cetsasoft FTE Contract Monthly.docx`

Expected request body:

```json
{
  "Name": "Employee Name",
  "starteEndDate": "1 April 2026 to 31 March 2027",
  "Identity": "ID123",
  "Address": "Address line",
  "JobTitle": "Developer",
  "commencementDate": "1 April 2026",
  "ID": "EMP001",
  "perHour": "500",
  "authorityName": "Authorized Signatory",
  "authorityRole": "Director",
  "authorityPhone": "9999999999",
  "contractType": "Hourly"
}
```

Response data:

```json
{
  "docxUrl": "https://...",
  "pdfUrl": "https://..."
}
```

### `POST /employee/uploadindependentDocument`

Generates an independent contractor agreement, uploads DOCX and PDF versions, and returns their URLs.

Template used:

- `middleware/Independent_Contractor_Agreement.docx`

Expected request body:

```json
{
  "entityName": "Entity Name",
  "registrationNumber": "REG123",
  "address": "Address",
  "postalAddress": "Postal Address",
  "telNumber": "123456",
  "cellNumber": "9999999999",
  "email": "company@example.com",
  "name": "Contractor Name",
  "IDNUMBER": "ID123",
  "JOBTITLE": "Consultant",
  "cDate": "2026-04-01",
  "endDate": "2027-04-01",
  "servicesDel": "Development services",
  "remuniration": "1000",
  "contractType": "Independent"
}
```

## Activity

### `POST /activity/create`

Creates an activity log entry.

Request body:

```json
{
  "userID": "6612d87c...",
  "Activity": "Created candidate profile",
  "userName": "John Doe"
}
```

## Scheduled Feature

If `ENABLE_CRON=true`, the app runs a daily job:

- Schedule: `0 0 * * *`
- Checks for candidates with `createdAt` older than 30 days
- Sends an email containing candidate name, surname, and creation date

This uses:

- Mongo query on the `candidates` collection
- SMTP via `nodemailer`

## Deployment

[`vercel.json`](./vercel.json) is configured to deploy `app.js` as a Vercel Node function and route all requests to it.

## Known Implementation Notes

- `forgotPassword` exists as a route but is not actively implemented.
- Several routes are unauthenticated even though auth middleware is imported.
- Candidate update logic is split between `update` and `update1`, with different behaviors.
- There are hardcoded secrets/credentials in the current codebase for JWT, Mongo fallback URIs, DigitalOcean Spaces, and ApyHub. These should be moved to environment variables before production use.
- `models/candidates.js` and `candidates.js` do not fully match; the API currently imports `models/candidates.js`.
- `serverProd` in `package.json` references `index.js` and has `prduction` misspelled; the actual entry file in this folder is `app.js`.

## Suggested Request Testing

Example health smoke test via any existing endpoint:

```bash
curl http://localhost:5001/candidates/get1
```

Create candidate with files:

```bash
curl -X POST http://localhost:5001/candidates/create \
  -F "name=Jane" \
  -F "surName=Smith" \
  -F "email=jane@example.com" \
  -F "contactNo=9999999999" \
  -F "files=@/path/to/resume.pdf"
```
