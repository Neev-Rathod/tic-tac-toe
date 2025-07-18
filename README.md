
# 🎮 Tic Tac Toe - Multiplayer Game

A multiplayer Tic Tac Toe game built with the **MERN stack**, **JWT-based authentication**, **Socket.IO**, **real-time chat**, and **private room creation**.

🔗 **Live Demo**: [https://tic-tac-toe-t9x2.vercel.app](https://tic-tac-toe-t9x2.vercel.app)

---

## 📌 Features

- 🔐 **User Authentication** using JWT
- 🧑‍🤝‍🧑 **Create Private Rooms** with invite-only access
- 🕹️ **Real-time Multiplayer Game** using Socket.IO
- 📜 **Game History** with recorded steps
- 💬 **In-room Chat**
- 🎨 **Frontend built with Tailwind CSS, React, and Lucide icons**
- 📡 **Backend API with Express.js and MongoDB**

---

## 🧰 Tech Stack

| Layer      | Technology             |
|-----------|------------------------|
| Frontend  | React, Tailwind CSS, Lucide Icons, Axios, Socket.IO |
| Backend   | Node.js, Express.js, Socket.IO, MongoDB, Mongoose |
| Auth      | JWT (JSON Web Token) |
| Hosting   | Vercel (Frontend), onrender (Backend) |

---

## 📦 Local Development Setup

### Prerequisites

- Node.js (v16+)
- npm
- MongoDB (local or Atlas)
- Git

---

### Steps to Run Locally

```bash
# Clone the repository
git clone https://github.com/Neev-Rathod/tic-tac-toe.git
cd tic-tac-toe
```

#### 🔧 Frontend

```bash
cd frontend
npm install
npm run dev
```

> The frontend will run on `http://localhost:5173` by default (or as configured in Vite)

#### 🔧 Backend

```bash
cd ../backend
npm install
npm run dev
```

> The backend will run on `http://localhost:5000`

---

## ⚙️ Environment Variables

### 📁 `backend/.env`

```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/tictactoe
JWT_SECRET=your_jwt_secret_key
```

### 📁 `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## 📚 Folder Structure

```
tic-tac-toe/
├── backend/        # Node.js + Express + Socket.IO
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   └── server.js
├── frontend/       # React + Tailwind + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── index.html
└── README.md
```

---

## 🧪 Features Explained

### 🔐 JWT Authentication

- Users can register and log in.
- JWT tokens are used for secure API calls.
- Protected routes ensure only authenticated users can create or join rooms.

### 🧑‍🤝‍🧑 Private Room Creation

- Users can create private rooms.
- Only invited users can join via a unique room ID.

### 🕹️ Real-time Game

- Real-time game moves using **Socket.IO**.
- Game state is synced between players in real time.

### 📜 Game History

- Every move is recorded and displayed in a history panel.
- Step-by-step replay is supported.

### 💬 Chat in Room

- Players can chat inside the room while the game is ongoing.
- Messages are real-time via Socket.IO.

---

## 🧑‍💻 Contributing

Contributions are welcome! If you'd like to improve the app, feel free to open an issue or submit a pull request.
