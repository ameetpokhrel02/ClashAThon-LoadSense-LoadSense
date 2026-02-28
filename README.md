# LoadSense  
### Academic Overload Detection System

LoadSense is a workload intelligence platform that helps students detect academic overload before it happens by transforming scattered deadlines into actionable insights.

---

## Problem Statement

In semester-based colleges, assignments, vivas, quizzes, and group projects are scheduled independently by instructors.  
This often leads to **deadline clustering**, where multiple major evaluations occur within the same week.

As a result, students:

- Miss deadlines  
- Submit rushed or low-quality work  
- Experience burnout  
- Face conflicts in group projects  

Existing academic portals only **display schedules** — they do not analyze workload intensity.

---

##  Solution Overview

LoadSense analyzes academic workload patterns and identifies overload **before it becomes overwhelming**.

The system:

- Tracks deadlines  
- Calculates weekly workload  
- Detects high-risk weeks  
- Sends overload alerts  

This enables:

✔ Better planning  
✔ Reduced stress  
✔ Improved academic performance  

---

## Unique Selling Proposition

Unlike traditional LMS platforms that only show deadlines,  
**LoadSense intelligently evaluates workload intensity** and highlights overload risks early.

It shifts students from *reactive submission* to *proactive preparation*.

---

##  Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## System Architecture

LoadSense follows a **3-layer architecture**:

### Interface Layer
React.js Web Application

### Logic Layer
Node.js + Express workload analysis engine

### Storage Layer
MongoDB for persistence

Future-ready AI module enables smart study planning.

---
## Project Structure
```bash
LoadSense/
│
├── src/
│   │
│   ├── frontend/                      # React + TypeScript Client Application
│   │   │
│   │   ├── public/                    # Static assets
│   │   │   └── index.html
│   │   │
│   │   ├── src/
│   │   │   ├── assets/                # Images, icons, fonts
│   │   │   ├── components/
│   │   │   │   ├── ui/                # shadcn/ui base components
│   │   │   │   └── layout/            # Navbar, Sidebar, Layout wrappers
│   │   │   │
│   │   │   ├── pages/                 # Route-level pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Courses.tsx
│   │   │   │   ├── Deadlines.tsx
│   │   │   │   └── Auth/
│   │   │   │
│   │   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── context/               # Global state providers
│   │   │   ├── services/              # API calls (Axios)
│   │   │   ├── utils/                 # Helper functions
│   │   │   ├── types/                 # TypeScript interfaces
│   │   │   ├── routes/                # Route configuration
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   │
│   │   ├── .env
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── backend/                       # Node.js + Express API Server
│       │
│       ├── src/
│       │   ├── config/                # DB & environment configuration
│       │   │   └── db.js
│       │   │
│       │   ├── controllers/           # Business logic handlers
│       │   │   ├── authController.js
│       │   │   ├── courseController.js
│       │   │   ├── deadlineController.js
│       │   │   └── workloadController.js
│       │   │
│       │   ├── models/                # Mongoose schemas
│       │   │   ├── User.js
│       │   │   ├── Course.js
│       │   │   ├── Deadline.js
│       │   │   └── Workload.js
│       │   │
│       │   ├── routes/                # Express route definitions
│       │   │   ├── authRoutes.js
│       │   │   ├── courseRoutes.js
│       │   │   ├── deadlineRoutes.js
│       │   │   └── workloadRoutes.js
│       │   │
│       │   ├── middleware/            # Authentication & error middleware
│       │   │   ├── authMiddleware.js
│       │   │   └── errorMiddleware.js
│       │   │
│       │   ├── services/              # Workload calculation engine
│       │   │   └── workloadService.js
│       │   │
│       │   ├── utils/                 # Helper utilities
│       │   ├── app.js                 # Express app configuration
│       │   └── server.js              # Entry point
│       │
│       ├── .env
│       ├── package.json
│       └── nodemon.json
│
├── docs/                              # Documentation & diagrams
│   ├── ERD.png
│   ├── API-Docs.md
│   └── Architecture.md
│
├── .gitignore
├── README.md
└── package.json                       # (Optional) Root workspace config
```

##  MVP Features

## Core Features

- Student Authentication  
- Course Management  
- Deadline Tracking  
- Weekly Workload Calculation  
- Overload Detection Alerts  
- AI Study Planner (Implemented)
- Smart Workload Insights  

##  AI Study Planner

LoadSense includes an integrated AI Study Planner that generates personalized study plans based on:

- Upcoming deadlines
- Workload intensity
- Task priority

Students can:

✔ View AI-generated study suggestions  
✔ Convert suggestions into tasks  
✔ Track study progress inside the platform  

This allows students not only to **analyze workload** but also to **act on it directly within the system**.


##  Setup Instructions (Run Locally)

### 1 Clone Repository

```bash
git clone https://github.com/ameetpokhrel02/ClashAThon-LoadSense-LoadSense
cd LoadSense

2️ Backend Setup
cd backend
npm install
npm run dev

3️ Frontend Setup
cd frontend
pnpm install
pnpm dev
```
App runs at:

http://localhost:5173
Environment Variables

Create a .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key   # Optional (future AI)

Create .env in frontend:

VITE_API_URL=http://localhost:5000
Deployment
Service	Platform
Frontend	Vercel
Backend	Render
Database	MongoDB Atlas

Live deployment enables access through public URL.
live url https://loadsense.vercel.app

Expected Impact

LoadSense improves:

Time management

Academic performance

Workload visibility

Student well-being

It enables institutions to monitor workload distribution and reduce academic overload risks.

Team Members
Name	Role
Amit Pokhrel	Frontend (Interface Layer)
Samir Bhandari	Backend (Logic Layer)
Aaryan Karki	Backend Logic
Anish Tamang	Database (Storage Layer)
Isha Karki	Research & Business

Business Perspective

LoadSense can be offered to colleges as a SaaS platform.

Benefits:

Reduced student overload

Improved academic coordination

Better performance tracking

Future LMS integration expands scalability.

Future Scope

- LMS Integration  
- Faculty Analytics Dashboard  
- Institutional Workload Monitoring  
- Predictive Academic Risk Detection  

Hackathon Alignment

✔ Real-world problem
✔ Practical solution
✔ Technical feasibility
✔ Business sustainability

Built for Clash-a-Thon 2026

Transforming academic chaos into clarity.

