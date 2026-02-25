# 🏗 LoadSense – System Architecture

## 1. Overview

LoadSense is a workload intelligence platform designed to detect academic overload caused by clustered deadlines, assignments, vivas, and exams.

The system follows a **3-layer architecture**:

Interface Layer → Logic Layer → Storage Layer

This architecture ensures modularity, scalability, and ease of deployment.

---

## 2. Architecture Layers

### 2.1 Interface Layer (Frontend)

Built using:

- React + TypeScript
- TailwindCSS
- shadcn/ui
- pnpm

Provides:

- Dashboard visualization
- Deadline management
- Course/module tracking
- Calendar view
- Workload heatmap
- Overload alerts
- AI Study Plan UI

Key Screens:

- Landing Page
- Login / Register / OTP
- Dashboard
- Courses (Modules)
- Deadlines
- Calendar
- Insights
- Smart Study Plan
- Profile & Settings

Frontend communicates with backend using REST APIs.

---

### 2.2 Logic Layer (Backend)

Built using:

- Node.js
- Express.js
- npm

Handles:

- Authentication
- Course management
- Deadline tracking
- Workload calculation
- Overload detection
- Reminder generation
- AI Study Plan logic

Core Modules:

| Module | Responsibility |
|--------|---------------|
| Auth | Login, Register, OTP, Reset |
| Modules | Course CRUD |
| Deadlines | Task CRUD |
| Workload | Load score calculation |
| Insights | Risk patterns & trends |
| Reminder | Upcoming deadline alerts |
| AI Plan | Study suggestions |

---

### 2.3 Storage Layer (Database)

Uses:

- MongoDB Atlas

Stores:

- Users
- Courses / Modules
- Deadlines
- Weekly Workload Data
- Insights
- AI Suggestions

Relationships:

User → Modules → Deadlines → Workload

---

## 3. Workload Detection Logic

System calculates overload using:

Adjusted Weight = Task Weight × Course Credit

Each task type has base weight:

| Type | Weight |
|------|--------|
| Assignment | 1 |
| Quiz | 2 |
| Viva | 2 |
| Group Project | 3 |
| Midterm | 4 |
| Final | 5 |

Weekly load is calculated:

Weekly Load Score = Sum of all adjusted task weights

Risk Levels:

| Load Score | Risk |
|-----------|------|
| 0–3 | Low |
| 4–6 | Moderate |
| 7–10 | High |
| 11+ | Critical |

---

## 4. AI Study Plan Flow

1. Detect upcoming deadlines
2. Analyze workload intensity
3. Identify high-risk weeks
4. Suggest study allocation
5. Recommend preparation start time

Future integration:
Google Gemini API for intelligent planning.

---

## 5. Data Flow

Frontend → REST API → Backend Logic → MongoDB → Response → UI

---

## 6. Deployment Architecture

Frontend → Vercel  
Backend → Render  
Database → MongoDB Atlas

---

## 7. Scalability

Future-ready for:

- LMS integration
- Multi-institution support
- AI automation
- Predictive academic planning