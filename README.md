# IdeaLink 🚀

> A global platform connecting startup founders with service providers, co-founders, and talent — across borders, in real time.

---

## What is IdeaLink?

IdeaLink is a full-stack web application that allows startup founders to post what their startup needs (team members, services, workspace) and service providers to offer their skills or resources. Once connected, users can chat in real time and jump into a video call — all inside the platform.

**Built to solve a real problem:** A startup founder in India can find a marketing partner in the US, a logistics provider in UAE, or a developer in Europe — all verified, all in one place.

---

## Features

- **Authentication** — Secure register and login with JWT (JSON Web Token)
- **Role Selection** — Choose your role during onboarding: Startup Founder, Service Provider, or Both
- **Identity Verification** — Upload a government ID (passport, national ID, driver's license) during onboarding for trust and credibility
- **Post Ideas** — Post what your startup needs or what you offer, with category and skill tags
- **Global Feed** — Browse posts filtered by category, country, and skills needed
- **Connect System** — Send, accept, or decline connection requests
- **Real-Time Chat** — Chat with connections via WebSockets (Socket.io)
- **Video Calls** — Peer-to-peer video calls using WebRTC (RTCPeerConnection + STUN)
- **Social Links** — Add GitHub, LinkedIn, Instagram, X, or portfolio links to your profile
- **Public/Private Profile** — Your own profile (editable) and public profiles (read-only)
- **Login Wall** — Feed requires authentication; landing page is public

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework and routing |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Socket.io | Real-time WebSocket communication |
| Multer | File uploads (government ID documents) |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests to backend API |
| Socket.io-client | Real-time chat connection |
| WebRTC (RTCPeerConnection) | Peer-to-peer video calls |
| Context API | Global auth state management |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Google STUN Server | ICE candidate discovery for WebRTC |

---

## Architecture

This project follows **MVC + Service Layer** architecture on the backend.

```
Request → Route → Controller → Service → Model → Database
                     ↓
                 Response
```

- **Routes** — Map URLs to controller functions
- **Controllers** — Receive requests, send responses (thin layer)
- **Services** — All business logic lives here (validation, rules, transformations)
- **Models** — MongoDB schemas and database interaction only

This separation means changing business logic never requires touching the HTTP layer, and vice versa.

---

## Project Structure

```
idealink/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ideaController.js
│   │   └── connectionController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── ideaService.js
│   │   └── connectionService.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Idea.js
│   │   ├── Connection.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ideaRoutes.js
│   │   └── connectionRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── uploads/
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Onboarding.jsx
        │   ├── Feed.jsx
        │   ├── PostIdea.jsx
        │   ├── Profile.jsx
        │   ├── Connections.jsx
        │   ├── Chat.jsx
        │   └── HowItWorks.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── IdeaCard.jsx
        │   └── ProtectedRoute.jsx
        └── App.jsx
```

---

## How Real-Time Works

### Chat (Socket.io)
1. User opens a chat page → connects to Socket.io server
2. Both users emit `join_room` with the connection ID → server places them in a Socket.io room
3. User sends message → server saves it to MongoDB, broadcasts it to everyone in the room
4. Other user receives the message instantly via `receive_message` event

### Video Call (WebRTC)
1. Caller clicks "Video Call" → accesses camera/mic via `getUserMedia`
2. Creates `RTCPeerConnection` with Google STUN server for NAT traversal
3. Generates an **offer** (SDP) → sends to other user via Socket.io signaling
4. Other user receives offer → generates an **answer** → sends back
5. ICE candidates exchanged via Socket.io → WebRTC finds the best network path
6. Direct peer-to-peer video/audio stream established (server not involved)

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login and get token |
| GET | `/api/auth/me` | Yes | Get own profile |
| PUT | `/api/auth/me` | Yes | Update profile |
| PATCH | `/api/auth/me/role` | Yes | Update role |
| PATCH | `/api/auth/me/social` | Yes | Update a social link |
| POST | `/api/auth/me/verify` | Yes | Submit government ID |
| GET | `/api/auth/user/:id` | No | Get public profile |

### Ideas
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/ideas` | No | Get all ideas (filterable) |
| GET | `/api/ideas/:id` | No | Get single idea |
| POST | `/api/ideas` | Yes | Create idea |
| PUT | `/api/ideas/:id` | Yes | Update idea (owner only) |
| DELETE | `/api/ideas/:id` | Yes | Delete idea (owner only) |

### Connections
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/connections/request` | Yes | Send connection request |
| PUT | `/api/connections/request/:id` | Yes | Accept or decline request |
| GET | `/api/connections/mine` | Yes | Get accepted connections |
| GET | `/api/connections/requests` | Yes | Get pending incoming requests |
| GET | `/api/connections/:id/messages` | Yes | Get chat history |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/moreinn/idealink.git
cd idealink
```

#### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the backend:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

#### Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

App runs on `http://localhost:5173`

---

## Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `join_room` | Client → Server | Join a chat room |
| `send_message` | Client → Server | Send a chat message |
| `receive_message` | Server → Client | Receive a chat message |
| `call_user` | Client → Server | Send WebRTC offer |
| `incoming_call` | Server → Client | Receive WebRTC offer |
| `accept_call` | Client → Server | Send WebRTC answer |
| `call_accepted` | Server → Client | Receive WebRTC answer |
| `ice_candidate` | Both | Exchange ICE candidates |
| `end_call` | Client → Server | End the call |
| `call_ended` | Server → Client | Notify other user call ended |

---

## Key Concepts Used

- **JWT Authentication** — Stateless auth using signed tokens, no server-side sessions
- **Password Hashing** — bcrypt with salt rounds, passwords never stored in plain text
- **MVC + Service Layer** — Clean separation between routing, logic, and data
- **WebSockets** — Persistent connections for real-time bidirectional communication
- **WebRTC** — Browser-native peer-to-peer media streaming
- **ICE/STUN** — Network traversal for WebRTC across different networks
- **Multer** — Multipart form data handling for file uploads
- **Mongoose Populate** — MongoDB document references resolved at query time
- **Protected Routes** — Frontend + backend route guards using JWT middleware
- **Context API** — React global state without external state libraries

---

## Author

Built by [Moinuddin Shaikh](https://github.com/moreinn)

---


