# Task Manager API - Backend Documentation

A secure, scalable REST API with authentication, role-based access control, and complete CRUD operations for task management.

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Role-Based Access](#role-based-access)
- [Sample API Calls](#sample-api-calls)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Project Structure](#project-structure)
- [Testing the API](#testing-the-api)
- [Scalability Note](#scalability-note)

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Winston | Logging |
| Express Validator | Input validation |
| Helmet | Security headers |
| CORS | Cross-origin resource sharing |
| Express Rate Limit | Rate limiting |

---

## ✅ Features

- **User Authentication**
  - Register new users (first user becomes admin)
  - Login with email and password
  - JWT token-based authentication
  - Password hashing with bcrypt

- **Role-Based Access Control**
  - **User Role**: Can only access their own tasks
  - **Admin Role**: Can access and manage all tasks

- **Task Management (CRUD)**
  - Create tasks with title, description, status, priority
  - Read tasks (own or all for admin)
  - Update tasks
  - Delete tasks

- **Security Features**
  - Password hashing
  - JWT token expiration
  - Input validation & sanitization
  - Rate limiting (100 requests per 15 minutes)
  - Security headers with Helmet
  - CORS enabled

- **Additional Features**
  - API versioning (v1)
  - Error handling middleware
  - Winston logging (console + files)
  - MongoDB connection with Mongoose
  - Environment-based configuration

---

## 🔧 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd backend
Install dependencies

bash
npm install
Create logs directory

bash
mkdir logs
Create environment file

bash
cp .env.example .env
Update the .env file with your configuration (see below)

🌍 Environment Variables
Create a .env file in the root directory:

env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/taskmanager
# For MongoDB Atlas use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10

# Admin Secret (for creating admin users)
ADMIN_SECRET=admin123
🏃 Running the Server
Development Mode (with auto-restart)
bash
npm run dev
Production Mode
bash
npm start
Expected Output
text
Server running on port 5000
MongoDB Connected: localhost:27017/taskmanager
Logger initialized. Log files will be written to: C:\path\to\backend\logs
📚 API Documentation
Once the server is running, you can access:

Swagger UI: http://localhost:5000/api-docs

Health Check: http://localhost:5000/health

📡 API Endpoints
Base URL
text
http://localhost:5000/api/v1
Authentication Routes
Method	Endpoint	Description	Access	Request Body
POST	/auth/register	Register new user	Public	{ "name": "John", "email": "john@example.com", "password": "123456" }
POST	/auth/login	Login user	Public	{ "email": "john@example.com", "password": "123456" }
GET	/auth/me	Get current user	Private	-
Task Routes (All require authentication)
Method	Endpoint	Description	Access	Request Body
GET	/tasks	Get all tasks	Private	-
GET	/tasks/:id	Get single task	Private	-
POST	/tasks	Create task	Private	{ "title": "Task name", "description": "Details", "status": "pending", "priority": "medium" }
PUT	/tasks/:id	Update task	Private	{ "title": "Updated", "status": "completed" }
DELETE	/tasks/:id	Delete task	Private	-
🔐 Authentication
How to Authenticate
Register or Login to get a JWT token

Include the token in subsequent requests:

text
Authorization: Bearer <your_jwt_token>
Sample Login Response
json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
👥 Role-Based Access
User Role
Can only see their own tasks

Can only edit/delete their own tasks

Default role for new users (after first user)

Admin Role
Can see all tasks from all users

Can edit/delete any task

First user becomes admin automatically

Additional admins can be created using admin secret: admin123

📝 Sample API Calls
1. Register a User
bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
Response:

json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
2. Login
bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
3. Create a Task
bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task manager assignment",
    "status": "pending",
    "priority": "high"
  }'
Response:

json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e2",
    "title": "Complete project",
    "description": "Finish the task manager assignment",
    "status": "pending",
    "priority": "high",
    "user": "65a1b2c3d4e5f6a7b8c9d0e1",
    "createdAt": "2024-01-16T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
4. Get All Tasks
bash
curl -X GET http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
5. Update a Task
bash
curl -X PUT http://localhost:5000/api/v1/tasks/65a1b2c3d4e5f6a7b8c9d0e2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "completed",
    "priority": "medium"
  }'
6. Delete a Task
bash
curl -X DELETE http://localhost:5000/api/v1/tasks/65a1b2c3d4e5f6a7b8c9d0e2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
⚠️ Error Handling
Common Error Responses
Status Code	Meaning	Example Response
400	Bad Request	{ "success": false, "message": "User already exists" }
401	Unauthorized	{ "success": false, "message": "Invalid credentials" }
403	Forbidden	{ "success": false, "message": "Not authorized" }
404	Not Found	{ "success": false, "message": "Task not found" }
500	Server Error	{ "success": false, "message": "Internal server error" }
Validation Errors
json
{
  "success": false,
  "errors": [
    {
      "msg": "Password must be at least 6 characters",
      "param": "password",
      "location": "body"
    }
  ]
}
📊 Logging
Log Files Location
text
backend/logs/
├── combined.log  # All application logs
└── error.log     # Only error logs
Sample Log Entries
combined.log:

json
{"level":"info","message":"Server started on port 5000","timestamp":"2024-01-16 10:00:00","service":"task-manager-api"}
{"level":"info","message":"New user registered: john@example.com","timestamp":"2024-01-16 10:05:23","service":"task-manager-api"}
{"level":"info","message":"Task created: \"Complete project\" by user: john@example.com","timestamp":"2024-01-16 10:07:12","service":"task-manager-api"}
error.log:

json
{"level":"error","message":"Login failed - Invalid credentials: john@example.com","timestamp":"2024-01-16 10:15:00","service":"task-manager-api"}
{"level":"error","message":"Task not found: 65a1b2c3d4e5f6a7b8c9d0e9","timestamp":"2024-01-16 10:16:20","service":"task-manager-api"}
📁 Project Structure
text
backend/
├── logs/                      # Log files directory
│   ├── combined.log           # All application logs
│   └── error.log              # Error logs only
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── taskController.js  # Task CRUD logic
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── validation.js      # Input validation
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   └── v1/
│   │       ├── authRoutes.js  # Auth endpoints
│   │       └── taskRoutes.js  # Task endpoints
│   ├── utils/
│   │   └── logger.js          # Winston logger
│   └── app.js                  # Express app setup
├── .env                        # Environment variables
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies
├── server.js                    # Entry point
└── README.md                    # This file
🧪 Testing the API
Using Postman
Import the provided Postman collection

Set environment variable base_url to http://localhost:5000/api/v1

Test endpoints in this order:

Register a user

Login (copy token)

Set token in Authorization header

Create tasks

Get tasks

Update a task

Delete a task

Using Curl Commands
bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"test123\"}"

# Login (save the token)
curl -X POST http://localhost:5000/api/v1/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"

# Create task (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/v1/tasks -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d "{\"title\":\"My Task\",\"priority\":\"high\"}"
📈 Scalability Note
Current Architecture
Monolithic Express.js application

MongoDB for data persistence

JWT for stateless authentication

Scalability Strategies
Horizontal Scaling

Deploy multiple instances behind a load balancer

Use PM2 cluster mode: pm2 start server.js -i max

Database Optimization

Add indexes on frequently queried fields

Implement MongoDB replication

Use MongoDB Atlas for auto-scaling

Caching Layer

Implement Redis for caching frequent queries

Cache user sessions and task lists

Microservices Ready

Auth Service (separate)

Task Service (separate)

User Service (separate)

Performance Enhancements

Response compression

Database query optimization

Pagination for large datasets

