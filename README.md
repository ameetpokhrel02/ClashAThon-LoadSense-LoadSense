# 🚀 LoadSense  
### Academic Overload Detection System

LoadSense is a workload intelligence platform that helps students detect academic overload before it happens by transforming scattered deadlines into actionable insights.

---

## 📌 Problem Statement

In semester-based colleges, assignments, vivas, quizzes, and group projects are scheduled independently by instructors.  
This often leads to **deadline clustering**, where multiple major evaluations occur within the same week.

As a result, students:

- Miss deadlines  
- Submit rushed or low-quality work  
- Experience burnout  
- Face conflicts in group projects  

Existing academic portals only **display schedules** — they do not analyze workload intensity.

---

## 💡 Solution Overview

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

## ⭐ Unique Selling Proposition

Unlike traditional LMS platforms that only show deadlines,  
**LoadSense intelligently evaluates workload intensity** and highlights overload risks early.

It shifts students from *reactive submission* to *proactive preparation*.

---

## ⚙️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 🧱 System Architecture

LoadSense follows a **3-layer architecture**:

### Interface Layer
React.js Web Application

### Logic Layer
Node.js + Express workload analysis engine

### Storage Layer
MongoDB for persistence

Future-ready AI module enables smart study planning.

---

## 🧩 MVP Features

- Student Authentication  
- Course Management  
- Deadline Tracking  
- Weekly Workload Calculation  
- Overload Detection Alerts  

---

## 🚀 Setup Instructions (Run Locally)

### 1️⃣ Clone Repository

```bash
git clone :https://github.com/ameetpokhrel02/ClashAThon-LoadSense-LoadSense
cd LoadSense

2️⃣ Backend Setup
cd backend
npm install
npm run dev

3️⃣ Frontend Setup
cd frontend
pnpm install
pnpm dev

App runs at:

http://localhost:5173
🔑 Environment Variables

Create a .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key   # Optional (future AI)

Create .env in frontend:

VITE_API_URL=http://localhost:5000
🌐 Deployment
Service	Platform
Frontend	Vercel
Backend	Render
Database	MongoDB Atlas

Live deployment enables access through public URL.
live url https://loadsense.vercel.app

📊 Expected Impact

LoadSense improves:

Time management

Academic performance

Workload visibility

Student well-being

It enables institutions to monitor workload distribution and reduce academic overload risks.

👥 Team Members
Name	Role
Amit Pokhrel	Frontend (Interface Layer)
Samir Bhandari	Backend (Logic Layer)
Aaryan Karki	Backend Logic
Anish Tamang	Database (Storage Layer)
Isha Karki	Research & Business
📈 Business Perspective

LoadSense can be offered to colleges as a SaaS platform.

Benefits:

Reduced student overload

Improved academic coordination

Better performance tracking

Future LMS integration expands scalability.

🔮 Future Scope

AI Study Planner

LMS Integration

Faculty Analytics

Predictive Academic Risk Detection

🏁 Hackathon Alignment

✔ Real-world problem
✔ Practical solution
✔ Technical feasibility
✔ Business sustainability

⭐ Built for Clash-a-Thon 2026

Transforming academic chaos into clarity.


---

# ✅ This README now satisfies Requirement 5.3 fully

Includes:

✔ Project Title  
✔ Problem  
✔ Solution  
✔ USP  
✔ Tech Stack  
✔ Setup  
✔ Environment Variables  
✔ Deployment  
✔ Team  

---

If you want, I can also generate:

📄 Final BUSINESS_MODEL.md  
📄 ARCHITECTURE.md diagram version  

for submission polish 🚀