#  EventFlow — AI-Powered Real-Time Collaboration Platform

## 🌐 Overview

EventFlow is a modern real-time collaboration platform designed to deliver seamless communication, live collaboration, and interactive teamwork experiences in a scalable SaaS-style environment.

Built with a production-focused architecture, EventFlow combines real-time messaging, video conferencing, collaborative whiteboards, file sharing, analytics dashboards, and distributed communication systems into one unified platform.

This project was developed to simulate the architecture and experience of modern collaboration platforms such as Discord, Slack, Microsoft Teams, and Zoom while showcasing advanced full stack engineering, real-time systems, scalable backend infrastructure, and modern UI/UX practices.

---

# ✨ Key Features

## 🔐 Authentication & Security

* JWT-based authentication system
* Secure login & registration flow
* Protected user sessions
* Persistent authentication using local storage

---

## 💬 Real-Time Messaging

* Real-time chat powered by Socket.io
* Multi-room collaboration support
* Typing indicators
* Live online user tracking
* Persistent message history using MongoDB

---

## 🎥 Video & Voice Communication

* Real-time video conferencing using WebRTC
* Voice calling support
* Mute / unmute controls
* Camera enable / disable functionality
* Live peer-to-peer media streaming

---

## 🖥️ Screen Sharing

* Real-time screen sharing
* Dynamic media stream replacement
* Interactive remote collaboration support

---

## 🖍️ Collaborative Whiteboard

* Live synchronized whiteboard
* Multi-user real-time drawing
* Shared collaborative workspace
* Instant canvas synchronization across connected clients

---

## 📎 File Sharing System

* Real-time file uploads
* Shared downloadable media inside rooms
* Multer-based backend upload handling

---

## 📊 Analytics Dashboard

* Live analytics visualization
* Message statistics
* Room activity metrics
* Upload tracking
* Real-time collaboration insights

---

## ⚡ Scalable Architecture

* Redis Socket.io adapter for horizontal scalability
* Dockerized infrastructure
* Real-time distributed event handling
* MongoDB persistence layer

---

## 🎨 Modern SaaS UI/UX

* Futuristic dark collaboration workspace
* Glassmorphism interface
* Responsive layout architecture
* Animated interactions using Framer Motion
* Modern icon system with Lucide React

---

# 🏗️ Tech Stack

## Frontend

* React.js
* Framer Motion
* Socket.io Client
* Axios
* Lucide React
* React Toastify

## Backend

* Node.js
* Express.js
* Socket.io
* JWT Authentication
* Multer

## Database

* MongoDB
* Mongoose

## Real-Time & Scaling

* WebRTC
* Redis
* Socket.io Redis Adapter

## DevOps & Deployment

* Docker
* Docker Compose

---

# 🧠 System Architecture

```text
Frontend (React)
        ↓
Socket.io Client
        ↓
Node.js + Express Server
        ↓
Redis Adapter (Scalable Real-Time Layer)
        ↓
MongoDB Database
```

---

# 🚀 Core Engineering Highlights

* Built a distributed real-time communication architecture
* Implemented peer-to-peer media streaming using WebRTC
* Designed scalable Socket.io infrastructure with Redis
* Developed collaborative state synchronization systems
* Created modern SaaS-inspired UI architecture
* Integrated live multi-user collaboration features
* Containerized the full application using Docker

---

# 📸 Major Functionalities

 Real-time Chat
 Multi-Room Collaboration
 Video Calling
 Voice Calling
 Screen Sharing
 Online Presence Detection
 Typing Indicators
 File Upload System
 Collaborative Whiteboard
 Analytics Dashboard
 JWT Authentication
 Dockerized Deployment
 Redis Scaling

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd eventflow-client
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd ../eventflow-server
npm install
```

---

## 4️⃣ Configure Environment Variables

Create `.env` inside backend:

```env
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
```

---

## 5️⃣ Start Docker Containers

```bash
docker compose up --build
```

---

# 🌍 Local Development URLs

## Frontend

```text
http://localhost:3000
```

## Backend

```text
http://localhost:5002
```

---

# 📈 Future Enhancements

* AI-powered meeting summaries
* End-to-end encryption
* Live collaborative documents
* Advanced meeting scheduling
* Cloud deployment pipeline
* Kubernetes orchestration
* Role-based access management

---

# 👨‍💻 Author

## Akshay Konagalla

Master’s in Computer Science — Florida Atlantic University
Full Stack Developer | Real-Time Systems Enthusiast | Cloud & DevOps Focused

---

# 🏆 Final Note

EventFlow was built to demonstrate production-grade engineering concepts including scalable real-time systems, collaborative architectures, WebRTC communication, distributed socket infrastructure, modern frontend design, and cloud-ready application development.

This project reflects a strong focus on:

* full stack engineering
* scalable architecture
* real-time collaboration systems
* modern SaaS product development
* advanced frontend experience design
