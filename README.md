# 💬 LetsChat - Full Stack Real-Time Chat Application

A premium full-stack real-time chat application built using the MERN stack, featuring a modern chat interface with real-time messaging, user presence tracking, and extensive customization options.

💡 **Development Note:** Built from scratch with custom backend architecture and modern frontend design patterns for optimal user experience and scalability.

🔗 Live Demo: [Coming Soon]

💻 GitHub Repo: [Your Repository Link]

---

## 🚀 Features
check LIVE: https://letschat-wp8r.onrender.com/
✨ **Real-Time Messaging** - Instant message delivery with Socket.io  
🔐 **Secure Authentication** - JWT-based auth with Clerk integration  
🟢 **Online Presence** - Real-time online/offline status tracking  
🖼️ **Media Sharing** - Image & video sharing with ImageKit optimization  
🎨 **13 Custom Wallpapers** - Personizable chat backgrounds  
🌈 **11 Color Themes** - Light/Dark mode with multiple theme presets  
📱 **Fully Responsive** - Mobile, tablet, and desktop optimized  
⚡ **WebSocket Integration** - Custom Socket.io server for real-time features  
💾 **Persistent Storage** - MongoDB for reliable data management  
🔔 **Webhook Integration** - Automatic user sync with Clerk events  
⏰ **Cron Jobs** - Background tasks for server maintenance  
📤 **Optimized Media Handling** - Cloud storage with ImageKit  
🛡️ **Advanced Middleware** - Custom authentication & file upload handling  

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Hero UI** - Beautiful component library
- **Socket.io Client** - Real-time communication
- **Zustand** - Lightweight state management
- **React Router 7** - Client-side routing
- **Axios** - HTTP client

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - REST API framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - WebSocket library
- **Clerk** - Authentication service
- **ImageKit** - Media optimization
- **Multer** - File upload handling
- **Cron** - Job scheduling

### Other Tools

- **JWT** - Secure authentication
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

---

## 📂 Project Structure

```
letschat/
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic (Auth, Messages)
│   │   ├── models/           # MongoDB schemas (User, Message)
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth & file upload middleware
│   │   ├── lib/              # Database, Socket.io, Cron setup
│   │   ├── webhooks/         # Clerk webhook handlers
│   │   └── seeds/            # Database seeding
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   └── index.js              # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   │   ├── chat/        # Chat-specific components
    │   │   └── auth/        # Authentication components
    │   ├── pages/            # Page routes (Auth, Chat)
    │   ├── store/            # Zustand global stores
    │   ├── context/          # React Context (Theme, Wallpaper)
    │   ├── hooks/            # Custom React hooks
    │   ├── lib/              # Utility functions & API setup
    │   ├── data/             # Static data (themes, wallpapers)
    │   └── styles/           # Global styles
    ├── .env.local            # Frontend environment variables
    ├── package.json          # Frontend dependencies
    └── main.jsx              # Entry point
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- MongoDB Atlas account (free tier)
- Clerk account (free tier)
- ImageKit account (free tier)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd letschat
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:

```bash
# Server Config
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/letschat

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxx

# ImageKit Media
IMAGEKIT_PRIVATE_KEY=xxxxx
IMAGEKIT_PUBLIC_KEY=xxxxx
IMAGEKIT_URL_ENDPOINT=https://xxxxx.imagekit.io

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env.local` file in frontend folder:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Key Features Explained

### Real-Time Messaging

- Uses Socket.io for bidirectional communication
- Messages delivered instantly without page refresh
- Automatic scrolling to latest messages
- Support for text, images, and videos

### User Presence Tracking

- Online/offline status badges
- Real-time user availability updates
- Active users list in sidebar

### Authentication & Security

- JWT-based authentication with Clerk
- Secure password hashing (Clerk handles)
- Webhook verification for user events
- Protected API routes with middleware

### Media Handling

- Image and video uploads with Multer
- ImageKit optimization & compression
- Responsive image loading on all devices

### Personalization

- 11 color themes (Blue, Violet, Rose, Green, etc.)
- Light/Dark mode toggle
- 13 custom wallpaper backgrounds
- User preferences saved locally

---

## 📚 What I Learned

- Building scalable real-time applications with WebSockets
- Implementing secure JWT-based authentication at scale
- Designing responsive UIs with Tailwind CSS
- Managing complex global state with Zustand
- Integrating third-party services (Clerk, ImageKit)
- Optimizing media handling for performance
- Setting up automated tasks with cron jobs
- Best practices in full-stack MERN development
- Production-ready error handling & validation

---

## 🔮 Future Improvements

🎙️ **Voice/Video Calls** - Real-time audio/video communication  
🔔 **Push Notifications** - Real-time notifications for messages  
💬 **Typing Indicators** - Show when user is typing  
📌 **Message Reactions** - Emoji reactions on messages  
🔍 **Message Search** - Full-text search across conversations  
👥 **Group Chats** - Support for group conversations  
📁 **File Sharing** - Share documents and files  
🤖 **AI Assistant** - Integrated AI chatbot support  

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Render/Railway)

```bash
npm run build
npm start
```

Ensure environment variables are set in deployment platform.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit pull requests for any improvements.

---

## 📬 Contact

- **GitHub**: https://github.com/theprashantyati
- **LinkedIn**: https://www.linkedin.com/in/prashant-yati-6157aa34a/
- **Email**: prashantyati3690@gmail.com


---

## ⭐ Support

If you like this project, please give it a star! It helps others discover the project and motivates continued development.

---

**Made with ❤️ by Prashant Yati**


