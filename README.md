# Chattify - Real-time Chat Application

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-blue.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%5E18.2.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%5E6.0.0-blue.svg)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/deployment-render-brightgreen.svg)](https://render.com/)

<p align="center">
  <img src="https://raw.githubusercontent.com/streamich/stream-chat-react/master/src/assets/logo.svg" alt="Chattify Logo" width="200">
</p>

<p align="center">
  <img src="frontend/public/preview-1.png" alt="Chattify Preview 1" width="250">
  <img src="frontend/public/preview-2.png" alt="Chattify Preview 2" width="250">
  <img src="frontend/public/preview-3.png" alt="Chattify Preview 3" width="250">
</p>

Chattify is a modern real-time chat application built with React, Node.js, and MongoDB. It features user authentication, friend management, real-time messaging with Stream Chat API, and video calling capabilities.

## 🌟 Features

- **User Authentication**: Secure signup, login, and logout functionality
- **Friend Management**: Send, accept, and manage friend requests
- **Real-time Messaging**: Instant messaging powered by Stream Chat API
- **Video Calling**: Peer-to-peer video calls using Stream Video SDK
- **User Profiles**: Customizable profiles with avatars and personal information
- **Notifications**: Real-time notifications for friend requests and messages
- **Responsive Design**: Fully responsive UI for both desktop and mobile devices
- **Theme Support**: Multiple themes with persistent user preferences

## 🏗️ Architecture Overview

### High-Level Architecture

```mermaid
graph TB
    A[Client - React Frontend] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[User Service]
    B --> E[Chat Service]
    B --> F[Notification Service]
    C --> G[(MongoDB)]
    D --> G
    E --> H[Stream Chat API]
    F --> G
    I[Stream Video SDK] --> J[Video Calling Service]
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 | UI Framework |
| | Vite | Build Tool |
| | Tailwind CSS | Styling |
| | DaisyUI | Component Library |
| | React Router | Navigation |
| | React Query | Server State Management |
| | Zustand | Client State Management |
| | Stream Chat React | Chat UI Components |
| | Stream Video SDK | Video Calling |
| **Backend** | Node.js | Runtime Environment |
| | Express.js | Web Framework |
| | MongoDB | Database |
| | Mongoose | ODM |
| | JWT | Authentication |
| | Stream Chat | Chat API |
| **Deployment** | Render | Cloud Hosting |
| | MongoDB Atlas | Database Hosting |

## 📁 Project Structure

```
Chattify/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── lib/            # Utility functions
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── constants/      # Application constants
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

## 🔧 Data Flow

### 1. User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB

    U->>F: Navigate to login/signup
    F->>U: Display auth form
    U->>F: Submit credentials
    F->>B: POST /api/auth/login
    B->>DB: Validate user
    DB-->>B: Return user data
    B->>F: Return JWT token
    F->>U: Store token & redirect
```

### 2. Chat Initialization Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant S as Stream API

    U->>F: Navigate to chat/:id
    F->>B: GET /api/chat/token
    B-->>F: Return Stream token
    F->>S: Connect with token
    S-->>F: Connection established
    F->>S: Create/Join channel
    S-->>F: Channel ready
    F->>U: Display chat interface
```

### 3. Video Call Flow

```mermaid
sequenceDiagram
    participant CU as Calling User
    participant RU as Receiving User
    participant F as Frontend
    participant S as Stream API

    CU->>F: Click video call button
    F->>S: Create call session
    S-->>F: Return call URL
    F->>S: Send message with call URL
    S->>RU: Receive call notification
    RU->>F: Click call notification
    F->>S: Join call session
    S-->>RU: Connect to call
    CU->>S: Accept connection
    S-->>CU: Establish video call
```

## 🗄️ Database Schema

### User Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | String | Yes | User's full name |
| email | String | Yes | Unique email address |
| password | String | Yes | Hashed password |
| bio | String | No | User biography |
| profilePic | String | No | Profile picture URL |
| nativeLanguage | String | No | User's native language |
| learningLanguage | String | No | Language user wants to learn |
| location | String | No | User's location |
| isOnboarded | Boolean | No | Onboarding completion status |
| friends | ObjectId[] | No | Array of friend IDs |
| timestamps | Date | No | Created/updated timestamps |

### FriendRequest Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sender | ObjectId | Yes | User who sent the request |
| recipient | ObjectId | Yes | User who received the request |
| status | String | No | Request status (pending/accepted/rejected) |
| timestamps | Date | No | Created/updated timestamps |

## 🚀 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Authenticate user |
| POST | `/logout` | Log out user |
| GET | `/me` | Get authenticated user |
| POST | `/onboarding` | Complete user onboarding |

### User Routes (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get recommended users |
| GET | `/friends` | Get user's friends |
| POST | `/friend-request/:id` | Send friend request |
| PUT | `/friend-request/:id/accept` | Accept friend request |
| GET | `/friend-requests` | Get incoming/outgoing friend requests |
| GET | `/outgoing-friend-requests` | Get outgoing friend requests |
| GET | `/:id` | Get user by ID |

### Chat Routes (`/api/chat`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/token` | Get Stream Chat token |

## 🎨 UI Components

### Core Components

| Component | Description |
|----------|-------------|
| Layout | Main application layout with sidebar and navbar |
| Navbar | Navigation header with user controls |
| Sidebar | Navigation menu for main pages |
| ChatPage | Full-screen chat interface |
| CallPage | Video call interface |
| HomePage | Main dashboard with friend recommendations |
| LoginPage | User authentication form |
| SignUpPage | User registration form |
| OnboardingPage | User profile setup |

### Feature Components

| Component | Description |
|----------|-------------|
| FriendCard | Display friend information |
| CallButton | Initiate video calls |
| ThemeSelector | Switch between UI themes |
| ChatLoader | Loading state for chat initialization |

## 🎯 State Management

### Client State (Zustand)

| Store | Purpose |
|-------|---------|
| useThemeStore | Manage UI theme preferences |
| useAuthUser | Manage authenticated user data |

### Server State (React Query)

| Query Key | Purpose |
|----------|---------|
| `["authUser"]` | Fetch authenticated user |
| `["streamToken"]` | Fetch Stream Chat token |
| `["user", id]` | Fetch user by ID |
| `["friends"]` | Fetch user's friends |
| `["recommendedUsers"]` | Fetch recommended users |
| `["friendRequests"]` | Fetch friend requests |

## 📱 Responsive Design

Chattify implements a mobile-first responsive design approach:

### Desktop View
- Full sidebar navigation
- Expanded chat interface
- Multi-column layouts

### Mobile View
- Collapsed sidebar (accessible via hamburger menu)
- Full-screen chat interface
- Touch-friendly controls
- Simplified navigation

## 🔐 Security

- Password hashing with bcrypt
- JWT-based authentication
- CORS configuration
- Input validation and sanitization
- Secure cookie handling
- Environment variable configuration

## 🚀 Deployment

### Render Deployment Configuration

Chattify is configured for deployment on Render with the following setup:

1. **Web Service** for the backend API
2. **Static Site** for the frontend build
3. **MongoDB Atlas** for database hosting

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `STREAM_API_KEY` | Stream Chat API key |
| `STREAM_API_SECRET` | Stream Chat API secret |
| `NODE_ENV` | Environment (development/production) |
| `VITE_STREAM_API_KEY` | Stream API key for frontend |

## 🧪 Testing

### Frontend Testing
- Component unit tests with Jest
- Integration tests with React Testing Library
- End-to-end tests with Cypress

### Backend Testing
- Unit tests for controllers and middleware
- Integration tests for API endpoints
- Database operation tests

## 📈 Performance Optimization

- React.memo for component memoization
- Lazy loading for code splitting
- React Query caching
- Image optimization
- Bundle size optimization
- Database indexing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stream Chat](https://getstream.io/chat/) for real-time messaging
- [Stream Video](https://getstream.io/video/) for video calling
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [DaisyUI](https://daisyui.com/) for component library
- [MongoDB](https://www.mongodb.com/) for database
- [Render](https://render.com/) for deployment platform

## 📞 Support

For support, please open an issue on the GitHub repository or contact the development team.