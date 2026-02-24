🚀 LoadSense
Academic Overload Detection System

LoadSense is a workload intelligence platform that helps students detect academic overload before it happens.
It transforms scattered deadlines into actionable insights to improve planning and reduce stress.

📌 Problem

In semester-based colleges, assignments, vivas, quizzes, and projects are scheduled independently by instructors.
This leads to deadline clustering, where multiple major evaluations occur within the same week.

Students often:

Miss deadlines

Submit low-quality work

Experience burnout

Face group conflicts

Existing portals only show schedules — they do not analyze workload intensity.

💡 Solution

LoadSense detects academic overload by:

Tracking deadlines

Calculating weekly workload

Identifying high-risk weeks

Alerting students early

This enables:

✔ Better planning
✔ Reduced stress
✔ Improved academic performance

🧱 System Architecture

LoadSense follows a 3-layer architecture:

Interface Layer

React.js Web Application

Logic Layer

Node.js + Express workload analysis engine

Storage Layer

MongoDB database

Future-ready AI module can be added for smart study planning.

🧩 Features (MVP)

Student Authentication

Course Management

Deadline Tracking

Weekly Workload Calculation

Overload Detection Alerts

📂 Project Structure
LoadSense/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── styles/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│
└── README.md
⚙️ Tech Stack

Frontend:

React

TypeScript

Tailwind CSS

shadcn/ui

Backend:

Node.js

Express.js

MongoDB

Deployment:

Vercel (Frontend)

Render (Backend)

MongoDB Atlas (Database)

🔐 API Modules

Authentication
Courses
Deadlines
Workload

Future:

AI Planning Module

▶️ How to Run
1. Clone Repository
git clone <repo-url>
cd LoadSense
2. Setup Backend
cd backend
npm install

Create .env

PORT=5000
MONGO_URI=your_mongodb_connection_string

Run:

npm run dev
3. Setup Frontend
cd frontend
pnpm install
pnpm dev
🌐 Data Flow

Student → Frontend → API → Backend Logic → MongoDB

📊 MVP Scope

Includes:

Deadline input

Workload visualization

Overload detection

Advanced features like AI planning are reserved for future scope.

👥 Team LoadSense

Amit Pokhrel — Frontend (Interface Layer)

Samir Bhandari — Backend (Logic Layer)

Aaryan Karki — Backend Logic

Anish Tamang — Database (Storage Layer)

Isha Karki — Research & Business

📈 Business Perspective

LoadSense can be offered to colleges as a SaaS solution.

Institutions benefit through:

Reduced student overload

Improved academic coordination

Better performance tracking

Future integration with LMS platforms expands scalability.

🔮 Future Scope

AI Study Planner

LMS Integration

Faculty Analytics

Cross-institution collaboration

🏁 Hackathon Alignment

LoadSense fulfills:

✔ Real-world problem
✔ Practical solution
✔ Technical feasibility
✔ Business potential

📄 License

For academic and hackathon use.

⭐ Built for Clash-a-Thon 2026

Transforming academic chaos into clarity.