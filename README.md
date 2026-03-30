# Suraksha Setu — AI-Enabled Herb-Drug Interaction Analysis System

> Bridging Ayurveda and Modern Medicine, Safely.

A government-supported web platform that uses Artificial Intelligence and molecular modelling to detect potential interactions between Ayurvedic formulations and modern pharmaceutical drugs — currently focused on diabetes management.

---

## Problem Statement

A significant percentage of diabetes patients in India simultaneously consume both modern pharmaceutical drugs (such as Metformin, Glipizide) and Ayurvedic formulations (such as Karela juice, Methi seeds, Madhunashini Vati). Most patients and even doctors are unaware that these combinations can cause dangerous interactions — including severe hypoglycemia, altered drug absorption, and enzyme interference. No reliable, India-specific tool currently exists to check these combinations before prescribing.

AyurInteract solves this.

---

## What It Does

- Accepts a modern drug name + Ayurvedic formulation as input
- Extracts active molecular compounds from both
- Uses AI and molecular docking models to predict interactions
- Returns a severity classification — **Safe**, **Caution**, or **Avoid**
- Provides a plain-language clinical reason for the result
- Shows a confidence score and links to supporting evidence
- Suggests safer alternatives when a combination is flagged
- Generates a downloadable PDF report for patient records

---

## Target Users

| Role | Description |
|---|---|
| **Admin** | Hospital IT manager — manages users, medicine database, system settings, analytics |
| **Doctor** | Ayurvedic or allopathic physician — manages patients, runs interaction checks, reviews AI results |
| **Patient** | Diabetes patient — views their medications, uses AI chat, receives safety alerts |

---

## Key Features

- AI-powered herb-drug interaction checker with severity levels
- Voice-enabled AI chatbox for natural language queries
- Patient profile with real-time BMI calculator
- Doctor-managed medication table with dosage and pre/post meal timing
- Role-based access control — Admin, Doctor, Patient
- Automated PDF report generation
- Smart alerts and notifications for high-risk combinations
- Searchable database of 200+ Ayurvedic formulations and modern drugs
- Audit logs and feedback flagging for continuous AI improvement
- Admin analytics dashboard with charts and usage statistics
- Multilingual support — English, Hindi, Marathi

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Framer Motion |
| Backend | Python (FastAPI / Flask) |
| AI / ML | Molecular docking models, NLP for chat, interaction prediction models |
| Database | PostgreSQL |
| PDF Generation | ReportLab / WeasyPrint |
| Voice Input | Web Speech API |
| Authentication | JWT-based role authentication |

---

## Disease Scope

| Disease | Status |
|---|---|
| Diabetes | Active |
| Hypertension | Coming Soon |
| Thyroid Disorders | Coming Soon |
| Arthritis | Coming Soon |
| Liver Disorders | Coming Soon |

---

## Project Structure
```
surakshasetu/
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/      # Login, Signup, Role Selection
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   ├── doctor/    # Doctor dashboard pages
│   │   │   └── patient/   # Patient dashboard pages
│   │   ├── components/    # Shared UI components
│   │   └── assets/        # Icons, illustrations, fonts
├── backend/               # FastAPI / Flask application
│   ├── api/               # Route handlers
│   ├── models/            # Database models
│   ├── ai/                # Interaction prediction logic
│   │   ├── molecular/     # Molecular docking models
│   │   └── nlp/           # Chat and query processing
│   └── database/          # DB config and migrations
├── data/
│   ├── drugs/             # Modern pharmaceutical database
│   └── herbs/             # Ayurvedic formulations database
└── docs/                  # Project documentation
```

---

## How It Works
```
Doctor adds patient
       ↓
Medicines and Ayurvedic formulations recorded with dosage and timing
       ↓
AI extracts active molecular compounds from each entry
       ↓
Molecular docking model checks for compound-level interactions
       ↓
Severity assigned — Safe / Caution / Avoid — with confidence score
       ↓
PDF report generated and saved to patient history
       ↓
Doctor and patient notified via in-app alert
```
