# Frontend (React) - Login & Signup Guide

This app uses **Clerk** for authentication. You can log in / sign up through the **/auth** page.

---

## 1) Prerequisites

- The backend must be running and reachable.
- You must have a valid **Clerk publishable key** configured in the frontend environment.

---

## 2) Start the frontend (local development)

From the repo root:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

---

## 3) Where to log in / sign up

1. Open the app in your browser.
2. Go to: **`/auth`**
   - Example: `http://localhost:5173/auth`
3. Use the Clerk UI to **Sign in** or **Create account**.

If you are already signed in, the app will redirect you to **`/` (Chat page)** automatically.

---

## 4) Manual signup & login flow

### Sign up

1. On `/auth`, choose **Create account** (or **Sign up**).
2. Enter your email (and name if prompted).
3. Complete any verification step required by Clerk.
4. After verification, you’ll be redirected to the chat experience.

### Log in

1. On `/auth`, choose **Sign in**.
2. Enter your email/password (or use any configured providers).
3. Complete verification if Clerk prompts it.
4. After successful login, you’ll land on **Chat (`/`)**.

---

## 5) Troubleshooting

### App keeps redirecting to `/auth`
- You’re not signed in, or Clerk isn’t loading correctly.
- Confirm your frontend env is set:
  - `VITE_CLERK_PUBLISHABLE_KEY`

### Auth fails / blank page
- Check the browser console for Clerk-related errors.
- Ensure the backend CORS/FRONTEND_URL is configured correctly.

---

## 6) Notes

- This README covers the **user-facing** login/signup steps.
- For production/deployment environment variables, refer to the root `README.md`.

