# Smart Leads Dashboard

A production-grade full-stack MERN application for managing sales leads with JWT authentication, role-based access control (RBAC), advanced filtering, and a modern responsive UI.

## 🚀 Features

- **JWT Authentication**: Secure login and registration with password hashing.
- **Role-Based Access Control (RBAC)**: 
  - **Admin**: Can create, update, and delete all leads.
  - **Sales User**: Can only view and update assigned leads.
- **Leads Management**: Full CRUD operations for sales leads.
- **Advanced Filtering**: Combined filtering by status, source, and search.
- **Pagination**: Backend-driven pagination for scalability.
- **CSV Export**: Export filtered leads to a CSV file.
- **Modern UI**: Built with React, TailwindCSS, and Lucide icons.
- **Dark Mode**: Fully supported dark theme.
- **Dockerized**: Easy setup using Docker and Docker Compose.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, React Query, React Hook Form, Zod, Axios.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, Zod.
- **DevOps**: Docker, Docker Compose.

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (or Docker)
- Docker & Docker Compose (optional)

### Local Setup

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env # Update variables
   npm run dev
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Setup

Run the following command in the root directory:
```bash
docker-compose up --build
```
- Frontend will be available at: `http://localhost:3000`
- Backend will be available at: `http://localhost:5000`

## 🔑 Environment Variables

### Backend (`/backend/.env`)
- `PORT`: 5000
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your secret key for JWT
- `NODE_ENV`: development/production

### Frontend (`/frontend/.env`)
- `VITE_API_URL`: `http://localhost:5000/api`

## 📁 Folder Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/      # DB and other configs
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Auth, Error, Validation
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Helpers
│   │   └── validators/  # Zod schemas
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios instance
│   │   ├── components/  # Reusable UI
│   │   ├── context/     # Auth state
│   │   ├── hooks/       # Custom hooks
│   │   ├── layouts/     # Page wrappers
│   │   ├── pages/       # Route pages
│   │   └── ...
└── docker-compose.yml
```


