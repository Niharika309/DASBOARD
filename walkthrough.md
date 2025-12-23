# MERN Stack Student Management System Walkthrough

I have implemented a complete MERN stack application that meets all the requirements of the intern assignment. The application features a modern, premium UI with a robust backend.

## 🏗️ Architecture

The project is divided into two main parts:
- **Backend (`/backend`)**: Node.js & Express server with MongoDB integration.
- **Frontend (`/frontend`)**: React application built with Vite and modern styling.

## 🔐 Authentication
- **JWT (JSON Web Token)**: Used for secure authentication. The token is generated upon login/signup and sent in the `Authorization` header for protected routes.
- **Password Hashing**: Implemented using `bcryptjs` to ensure user passwords are never stored in plain text.
- **Auth Middleware**: Custom middleware verifies the JWT and attaches the user object to the request. Role-based authorization ensures only Admins can access student management APIs.

## 📊 Dashboards

### 👨‍💼 Admin Dashboard
- **Student List**: A clean, sortable table showing all registered students.
- **Search**: Real-time search by name, email, or course.
- **CRUD Operations**:
  - **Create**: Add new students directly from the dashboard.
  - **Read**: View student details and enrollment dates.
  - **Update**: Edit existing student profiles.
  - **Delete**: Remove student records with confirmation.

### 🎓 Student Dashboard
- **Profile View**: A beautiful personal profile card with a banner and avatar.
- **Edit Profile**: Students can update their own name, email, and course.
- **Security**: "Change Password" functionality (Bonus requirement) allows students to update their security credentials.

## 🎨 Premium UI/UX
- **Glassmorphism**: Modern UI using semi-transparent backgrounds and backdrop blurs.
- **Animations**: Fluid transitions and entrance animations powered by `framer-motion`.
- **Icons**: Visual cues using `lucide-react` for better navigation.
- **Responsive**: Fully responsive design that works on mobile and desktop.

## 🛠️ How to Run
1. **Start MongoDB**: Ensure MongoDB is running locally.
2. **Backend**:
   - `cd backend`
   - `npm install`
   - `npm start`
3. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. **Access**: Visit `http://localhost:3000` in your browser.
