# Event Planner

A clean, full-stack event planning web application to post, manage, and browse event service requirements for planners, performers, and crew members.

🔗 **Live Demo:** [https://event-planner-brown-nu.vercel.app](https://event-planner-brown-nu.vercel.app)

---

## Overview

Event Planner is a full-stack platform built with Next.js and MongoDB that streamlines event hiring and coordination. It enables users to submit multi-step event service requirements, categorize staffing roles, and explore active event requests with dynamic filtering.

---

## Key Features

- **Multi-Step Requirement Wizard**: Intuitive step-by-step form to post event specifications, roles, budget, and contact info.
- **Category Filtering**: Instantly browse listings filtered by Planners, Performers, or Crew.
- **Serverless Backend**: High-performance Next.js API route handlers with connection-pooled MongoDB integration.
- **Responsive Modern UI**: Fast, mobile-first design built with Next.js 16 and React 19.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, CSS Modules
- **Backend**: Next.js Serverless Route Handlers
- **Database**: MongoDB & Mongoose
- **Hosting**: Vercel

---

## Local Setup

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
```

### 3. Run the App
```bash
# Start development server
npm run dev

# Or build and run for production
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Author

**Abhishek Yadav**  
GitHub: [@yadavabhishek07](https://github.com/yadavabhishek07)
