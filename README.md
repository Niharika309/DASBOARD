# MERN Stack Student Management System

A premium Student Management System built with the MERN stack for an intern assignment.

## Features
- **Authentication**: JWT-based login and signup with password hashing (bcrypt).
- **Role-Based Access**: Separate dashboards for Admins and Students.
- **Admin Dashboard**: 
  - View all students.
  - Search/Filter students.
  - Add, Edit, and Delete student records.
- **Student Dashboard**: 
  - Personal profile view.
  - Profile updates (Name, Email, Course).
  - Change Password functionality.
- **Rich UI**: Modern glassmorphism design, smooth animations (framer-motion), and responsive layout.

## Tech Stack
- **Frontend**: React (Vite), Context API, Axios, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt.

## Installation & Setup

### Prerequisites
- Node.js installed.
- MongoDB running locally at `mongodb://localhost:27017/mern-assignment` (or update `.env` in the backend).

### Backend Setup
1. Open a terminal in the `backend` folder.
2. Run `npm install`.
3. Start the server: `npm start` (or `node server.js`).
   - Server will run on `http://localhost:5000`.

### Frontend Setup
1. Open a terminal in the `frontend` folder.
2. Run `npm install`.
3. Start the dev server: `npm run dev`.
   - App will run on `http://localhost:3000`.

## Testing
- You can register as an **Admin** or a **Student** from the Sign Up page.
- Role-based redirection is handled automatically after login.
- Protected routes ensure users can only access their authorized dashboards.
