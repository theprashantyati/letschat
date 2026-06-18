# LetsChat Backend - Complete Architecture Guide

This is a comprehensive guide to the LetsChat backend, explaining each component, how they work together, and the code architecture in detail.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Core Architecture](#core-architecture)
3. [Database Models](#database-models)
4. [API Routes](#api-routes)
5. [Controllers](#controllers)
6. [Middleware](#middleware)
7. [Real-Time Features (Socket.io)](#real-time-features-socketio)
8. [Authentication](#authentication)
9. [Webhooks](#webhooks)
10. [Cron Jobs](#cron-jobs)
11. [Environment Setup](#environment-setup)
12. [Running the Server](#running-the-server)

---

## Project Structure

```
backend/
├── src/
│   ├── index.js                 # Main server entry point
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.js
│   │   └── message.controller.js
│   ├── models/                  # MongoDB schemas
│   │   ├── user.model.js
│   │   └── message.model.js
│   ├── routes/                  # API endpoints
│   │   ├── auth.route.js
│   │   └── message.route.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── lib/                     # Utilities & libraries
│   │   ├── db.js               # Database connection
│   │   ├── socket.js           # WebSocket setup
│   │   ├── cron.js             # Scheduled tasks
│   │   └── imagekit.js         # Media upload service
│   ├── webhooks/                # Webhook handlers
│   │   └── clerk.webhook.js
│   └── seeds/                   # Database seeding
│       └── user.seed.js
├── .env                         # Environment variables
└── package.json                 # Dependencies
```

---

## Core Architecture

### Server Entry Point (`index.js`)

The main server file initializes and configures the Express application:

```javascript
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = process.env.PORT;

// Middleware Setup
app.use(express.json());  // Parse JSON requests
app.use(cors({ origin: FRONTEND_URL, credentials: true }));  // Allow cross-origin requests
app.use(clerkMiddleware());  // Clerk authentication

// Routes
app.use("/api/auth", authRoutes);      // Authentication endpoints
app.use("/api/messages", messageRoutes); // Messaging endpoints

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});
```

**Key Points:**
- **CORS**: Allows requests only from the frontend URL for security
- **Clerk Middleware**: Validates authentication tokens from Clerk
- **Health Endpoint**: Used by cron jobs to keep the server alive
- **Webhook Middleware**: Processes Clerk authentication events in raw format

---

## Database Models

### User Model (`user.model.js`)

Stores user information synchronized with Clerk:

```javascript
const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true  // Links to Clerk's user ID
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ""  // URL from Clerk or custom image
  }
}, { timestamps: true });  // Auto createdAt & updatedAt
```

**Purpose**: Stores minimal user info. Full authentication is handled by Clerk.

### Message Model (`message.model.js`)

Stores chat messages with media support:

```javascript
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // References User document
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String  // Plain text message
  },
  image: {
    type: String  // ImageKit image URL
  },
  video: {
    type: String  // ImageKit video URL
  }
}, { timestamps: true });
```

**Purpose**: Stores all messages with support for text, images, and videos. Only one type needs to be populated per message.

---

## API Routes

### Authentication Routes (`auth.route.js`)

```javascript
router.get("/check", protectRoute, checkAuth);
```

**Endpoint**: `GET /api/auth/check`
- **Protected**: Requires valid authentication token
- **Returns**: Current user info (from JWT claims)
- **Usage**: Frontend checks if user is logged in

### Message Routes (`message.route.js`)

Handles message fetching and sending:

```javascript
router.get("/users", protectRoute, getUsers);           // Get all users
router.get("/conversations", protectRoute, getConversations); // Get user's chats
router.get("/:userId", protectRoute, getMessages);      // Get messages with user
router.post("/send/:receiverId", protectRoute, sendMessage); // Send message
```

---

## Controllers

### Auth Controller (`auth.controller.js`)

```javascript
export const checkAuth = async (req, res) => {
  try {
    const user = req.user;  // Set by Clerk middleware
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Message Controller (`message.controller.js`)

#### Get Users
```javascript
export const getUsers = async (req, res) => {
  const users = await User.find({ clerkId: { $ne: req.user.id } });
  res.json(users);
};
```
Returns all users except the current user for the user list.

#### Get Conversations
```javascript
export const getConversations = async (req, res) => {
  const userId = req.user.id;
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$senderId", userId] },
            "$receiverId",
            "$senderId"
          ]
        },
        lastMessage: { $last: "$text" },
        lastTime: { $last: "$createdAt" }
      }
    },
    { $sort: { lastTime: -1 } }
  ]);
  res.json(messages);
};
```
Uses MongoDB aggregation to get unique conversations and their last messages.

#### Get Messages
```javascript
export const getMessages = async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: req.user.id, receiverId: userId },
      { senderId: userId, receiverId: req.user.id }
    ]
  }).sort({ createdAt: 1 });
  res.json(messages);
};
```
Retrieves all messages between two users in chronological order.

#### Send Message
```javascript
export const sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { text, image, video } = req.body;
  
  const message = await Message.create({
    senderId: req.user.id,
    receiverId,
    text,
    image,
    video
  });
  
  // Emit via Socket.io to real-time recipient
  io.to(getReceiverSocketId(receiverId)).emit("newMessage", message);
  res.json(message);
};
```

---

## Middleware

### Auth Middleware (`auth.middleware.js`)

```javascript
export const protectRoute = async (req, res, next) => {
  try {
    // Clerk middleware sets req.auth
    if (!req.auth?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Get or create user in MongoDB
    const clerkId = req.auth.userId;
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      user = await User.create({
        clerkId,
        email: req.auth.sessionClaims?.email,
        fullName: req.auth.sessionClaims?.full_name
      });
    }
    
    req.user = { id: user._id, clerkId };
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Purpose**: Validates JWT, ensures user exists in MongoDB, and syncs with Clerk.

### Upload Middleware (`upload.middleware.js`)

```javascript
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export default upload;
```

**Purpose**: Parses file uploads from requests before passing to ImageKit.

---

## Real-Time Features (Socket.io)

### Socket Setup (`socket.js`)

```javascript
import { Server } from "socket.io";

const io = new Server(server, { 
  cors: { origin: [FRONTEND_URL] } 
});

// Track online users: { userId: socketId }
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId) userSocketMap[userId] = socket.id;
  
  // Broadcast online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
  // Handle disconnect
  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];  // Get socket ID of recipient
}
```

**How It Works:**
1. When user connects, socket ID is stored against their user ID
2. Server broadcasts list of online users to all clients
3. When sending a message, it's emitted directly to recipient's socket
4. On disconnect, user is removed from online list

**Frontend Integration:**
```javascript
// Frontend listens for events
socket.on("getOnlineUsers", (users) => {
  // Update UI with online status
});

socket.on("newMessage", (message) => {
  // Display received message in real-time
});
```

---

## Authentication

### Clerk Integration

**How It Works:**

1. **Frontend Auth**: User logs in via Clerk UI
2. **Token Generation**: Clerk creates JWT token
3. **Token Validation**: Every request includes token in header
4. **Middleware Check**: `clerkMiddleware()` validates token
5. **User Sync**: `protectRoute` ensures user exists in MongoDB

**Environment Variables:**
```
CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxx
```

---

## Webhooks

### Clerk Webhook (`clerk.webhook.js`)

```javascript
import { Webhook } from "svix";

export default async function handler(req, res) {
  const payload = req.body;
  const headers = req.headers;
  
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET);
  const evt = wh.verify(payload, headers);
  
  if (evt.type === "user.created") {
    // User just signed up - create DB record
    const user = await User.create({
      clerkId: evt.data.id,
      email: evt.data.email_addresses[0].email_address,
      fullName: evt.data.first_name + " " + evt.data.last_name
    });
  }
  
  if (evt.type === "user.deleted") {
    // User deleted account - clean up
    await User.deleteOne({ clerkId: evt.data.id });
  }
  
  res.json({ success: true });
}
```

**Purpose**: Syncs Clerk user events with MongoDB database automatically.

---

## Cron Jobs

### Auto-Keep-Alive (`cron.js`)

```javascript
import { CronJob } from "cron";

const job = new CronJob("*/14 * * * *", function () {
  // Every 14 minutes, send GET request to health endpoint
  const url = `${FRONTEND_URL}/health`;
  
  client.get(url, (res) => {
    console.log("Health check sent");
  });
});

export default job;
```

**Purpose**: Prevents server from sleeping on free hosting (e.g., Render, Heroku). Runs only in production.

---

## Environment Setup

### Required Environment Variables

Create `.env` file in backend folder:

```bash
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/letschat

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxx

# ImageKit Media Upload
IMAGEKIT_PRIVATE_KEY=xxxxx
IMAGEKIT_PUBLIC_KEY=xxxxx
IMAGEKIT_URL_ENDPOINT=xxxxx

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com
```

---

## Running the Server

### Development

```bash
cd backend
npm install
npm run dev
```

Uses `nodemon` for auto-restart on file changes.

### Production

```bash
npm run build   # Create dist folder
npm start       # Run from dist
```

### Seed Database (Optional)

```bash
npm run db:seed
```

Creates sample users in MongoDB for testing.

---

## Request/Response Flow

### Example: Send Message

1. **Frontend sends POST request:**
   ```
   POST /api/messages/send/receiverId
   Authorization: Bearer <token>
   Content-Type: application/json
   
   {
     "text": "Hello!",
     "image": null,
     "video": null
   }
   ```

2. **Backend processes:**
   - `clerkMiddleware()` validates token
   - `protectRoute` gets sender from token
   - `sendMessage` controller creates message in DB
   - Socket.io emits to recipient in real-time
   - Returns message object to sender

3. **Recipient receives:**
   - Socket.io event: `newMessage`
   - Updates UI instantly without refresh

---

## Security Features

1. **JWT Validation**: Clerk tokens verified on every request
2. **CORS**: Only frontend URL can access API
3. **Database Sync**: Users must exist in both Clerk and MongoDB
4. **Webhook Verification**: Clerk events are cryptographically signed
5. **Role-Based Routes**: Protected routes require authentication

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "MongoDB connection error" | Check MONGO_URI in .env |
| "Unauthorized" on requests | Verify CLERK_SECRET_KEY |
| "Socket connection failed" | Ensure FRONTEND_URL is correct |
| "Webhook verification failed" | Check CLERK_WEBHOOK_SIGNING_SECRET |

---

## Performance Optimization

- **Aggregation Pipeline**: Efficient conversation queries
- **Indexed Fields**: Email and clerkId are unique (auto-indexed)
- **Connection Pooling**: MongoDB connection reused
- **Memory Storage**: Multer uses memory for fast file handling

---

This backend is production-ready and can handle real-time messaging at scale!
