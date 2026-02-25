# 🚀 LoadSense Deployment Guide

## 1. Frontend Deployment (Vercel)

Tech Stack:

- React + TypeScript
- TailwindCSS
- pnpm

### Steps:

1. Push frontend code to GitHub
2. Go to: https://vercel.com
3. Import Project
4. Select:

Framework: Vite  
Root Directory: src/frontend

### Install Command:

pnpm install

### Build Command:

pnpm build

### Output Directory:

dist

---

## 2. Backend Deployment (Render)

Tech Stack:

- Node.js
- Express
- npm

### Steps:

1. Go to: https://render.com
2. Create Web Service
3. Connect GitHub repo

Settings:

Root Directory: src/backend

Build Command:

npm install

Start Command:

npm start

---

## 3. Environment Variables

Create .env in Render:
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
GEMINI_API_KEY=your_future_ai_key


---

## 4. Database Deployment

MongoDB Atlas used.

Allow access:

IP Whitelist → 0.0.0.0/0

---

## 5. API Connection

Frontend .env:


VITE_API_URL=https://your-render-backend-url


---

## 6. Deployment Architecture

Frontend → Vercel  
Backend → Render  
Database → MongoDB Atlas  

---

## 7. Future AI Deployment

Gemini AI integration planned for:

- Smart Study Plan
- Deadline preparation guidance