# Suraksha Setu

Suraksha Setu is a MERN healthcare web application for checking potential interactions between modern diabetes medicines and Ayurvedic formulations. It supports separate patient, doctor, and admin workflows, with JWT-secured APIs, MongoDB-backed clinical records, rule-based interaction checks, and Gemini-powered AI analysis for medicine-pair safety explanations.

The application is designed for hackathon and clinical-assistive use cases where doctors and patients need a simple dashboard to manage medicine records, review alerts, generate medication reports, and understand possible drug-herb risks. It is not a replacement for professional medical advice.

## Features

- Role-based authentication for patients, doctors, and admins
- Patient registration, login, profile viewing, and profile updates
- Doctor and admin access to patient lists and patient details
- Medication management for modern medicines and Ayurvedic formulations
- Medicine registry with search, type filtering, verification status, and admin verification
- Rule-based interaction checks for known modern medicine and Ayurvedic combinations
- Gemini-powered AI medicine interaction analysis
- Patient AI chat with text input, speech recognition, speech synthesis, language selection, and alert saving
- Doctor AI consultation flow for medication safety questions
- Patient and doctor alert dashboards with read/unread status
- Doctor-created patient alerts
- Admin dashboard metrics, analytics data, user directories, audit logs, and AI feedback review
- PDF report generation for patient medication and interaction history reports
- Responsive React UI built with Tailwind CSS, shadcn/ui-style components, Radix UI primitives, and Framer Motion
- MongoDB seed data for demo users, medicines, medications, alerts, and feedback

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod |
| Backend | Node.js, Express 4, TypeScript, Mongoose |
| Database | MongoDB |
| Authentication | JWT, bcryptjs, role-based middleware |
| AI | Google Gemini via `@google/genai`, using `gemini-3.5-flash` |
| Styling | Tailwind CSS, Radix UI primitives, lucide-react, Framer Motion, Recharts |
| Reports | jsPDF, jspdf-autotable |
| Testing | Vitest, Testing Library, Playwright configuration |
| Deployment | Vite production build for the frontend and Node.js production build for the backend. No platform-specific deployment config is committed. |

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Suraksha Setu"
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside `Backend/`:

```bash
cp .env.example .env
```

Update the values with your MongoDB connection string, JWT secret, and Gemini API key.

### 4. Start the backend

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### 5. Install frontend dependencies

Open a new terminal:

```bash
cd Frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment Variables

Backend environment variables are defined in `Backend/.env.example`.

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/suraksha_setu
JWT_SECRET=<your_jwt_secret>
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=<your_gemini_api_key>
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Backend server port. Defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. Defaults to local MongoDB if omitted. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT access tokens. |
| `FRONTEND_URL` | No | Present in the example file, but the current CORS setup does not use it. |
| `GEMINI_API_KEY` | Yes for AI | Google Gemini API key used by the AI interaction analyzer. |

The frontend currently uses a hardcoded API base URL of `http://localhost:5000` in `Frontend/src/hooks/useAuth.tsx`.

## AI Features

Suraksha Setu has two interaction-analysis paths:

1. A static rule-based checker in `Backend/src/routes/interactions.ts` for known combinations such as Metformin with Karela, Glipizide with Madhunashini Vati, and Insulin with Neem.
2. A Gemini-backed analyzer in `Backend/src/services/aiService.ts` exposed through `POST /api/ai/analyze`.

The Gemini service uses `gemini-3.5-flash` through `@google/genai`. The backend prompt requires valid JSON only and normalizes the model output into this response shape:

```json
{
  "summary": "Short patient-friendly explanation.",
  "confidence": 92,
  "riskLevel": "Low",
  "verdict": "Safe",
  "reasons": ["Reason 1", "Reason 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
```

Safety checks currently implemented:

- JWT authentication before AI access
- In-memory rate limit of 10 AI analysis requests per minute per IP
- Required `modernMedicine` and `ayurvedicMedicine` inputs
- Empty-string validation
- Maximum input lengths of 200 characters for each medicine and 1000 characters for context
- Basic prompt-injection pattern blocking
- JSON extraction, enum normalization, confidence clamping, and array length limiting
- Fallback error response when Gemini is unavailable or not configured

## Future Improvements

- Add a frontend environment variable for the API base URL.
- Persist currently client-only settings to backend APIs.
- Add backend controllers to separate route logic from Express route declarations.
- Add automated backend tests for authentication, authorization, and interaction checks.
- Add production CORS configuration using `FRONTEND_URL`.
- Add deployment configuration for selected platforms such as Vercel, Render, Railway, or Docker.
- Add real screenshot assets under a `docs/screenshots/` directory.
- Improve audit logging so user actions are recorded consistently across the API.

## Contributing

1. Fork the repository and create a feature branch.
2. Install dependencies in both `Frontend/` and `Backend/`.
3. Keep changes focused and aligned with the existing React, TypeScript, Express, and Mongoose patterns.
4. Do not commit `.env`, credentials, generated build output, or local dependency folders.
5. Run the relevant checks before submitting a pull request:

```bash
cd Frontend
npm run lint
npm run test
npm run build
```

```bash
cd Backend
npm run build
```

6. Include a clear pull request summary, testing notes, and screenshots for UI changes.
