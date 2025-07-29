# NoteTakingApp

A full-stack note-taking application with secure authentication, responsive UI.

## Features
- User authentication via Email/OTP and Google OAuth
- Secure signup/signin with OTP verification
- Responsive Material UI (MUI v2) frontend


## Tech Stack
- **Frontend:** React, Vite, TypeScript, Material UI, Axios, React Router
- **Backend:** Node.js, Express, TypeScript, Mongoose, JWT, nodemailer, otp-generator, bcryptjs, google-auth-library
- **Database:** MongoDB Atlas
- **Auth:** JWT, Google OAuth, Email/OTP

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/abhishek0450/NoteTakingApp.git
   cd NoteTakingApp/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in `backend/` with the following:
   ```env
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   CLIENT=https://your-frontend-url.vercel.app
   PORT=5000
   ```
4. Start the backend:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Go to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the frontend:
   ```sh
   npm run dev
   ```

## Deployment
- **Backend:** Deploy to [Render](https://render.com/)
- **Frontend:** Deploy to [Vercel](https://vercel.com/)

## Environment Variables
- See `.env.example` files in both `backend/` and `frontend/` for required variables.

## Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Set **Authorized JavaScript origins**:
   - `https://your-frontend-url.vercel.app`
   - `https://your-backend-url.onrender.com`
4. Set **Authorized redirect URIs**:
   - `https://your-backend-url.onrender.com/api/auth/google/callback`
5. Copy the client ID to your `.env` files

## Screenshots