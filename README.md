# 01Blog

A social blogging platform for students to share learning experiences, discoveries, and progress.

## 📖 Description

01Blog is a fullstack social platform that enables students to:
- Create and share posts with text and media
- Interact through likes and comments
- Follow other users and receive notifications
- Report inappropriate content

Administrators can manage users, posts, and reports through a secure dashboard with role-based access control.

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Angular        │◄───────►│  Spring Boot    │◄───────►│  PostgreSQL     │
│  Frontend       │  HTTP   │  Backend API    │  JDBC   │  Database       │
│  (Port 4200)    │         │  (Port 9090)    │         │  (Port 5432)    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

**Tech Stack:**
- **Frontend:** Angular, TypeScript, SCSS
- **Backend:** Java Spring Boot, Spring Security, JWT
- **Database:** PostgreSQL
- **Media Storage:** File system (uploads/)

## 📁 Project Structure

```
01blog/
├── 01blog-backend/          # Spring Boot backend
│   ├── src/main/java/com/blog/
│   │   ├── controller/      # REST API endpoints
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Database access
│   │   ├── model/           # Entities & DTOs
│   │   ├── security/        # JWT & authentication
│   │   └── config/          # App configuration
│   └── pom.xml
│
└── 01blog-frontend/         # Angular frontend
    ├── src/app/
    │   ├── core/            # Services, guards
    │   ├── features/        # Feature modules (auth, posts, admin)
    │   ├── shared/          # Reusable components
    │   ├── layout/          # Layout components
    │   ├── modules/         # Shared modules
    │   └── interceptors/    # HTTP interceptors
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 16+ & npm
- Docker (optional)
- PostgreSQL 15

### 1️⃣ Database Setup

**Option A: Using Docker**
```bash
docker run -d --name db_blog \
  -e POSTGRES_DB=db_blog \
  -e POSTGRES_USER=omrharbi \
  -e POSTGRES_PASSWORD=omrharbi \
  -p 5432:5432 \
  postgres:15
```

**Option B: Local PostgreSQL**
```sql
CREATE DATABASE db_blog;
CREATE USER omrharbi WITH PASSWORD 'omrharbi';
GRANT ALL PRIVILEGES ON DATABASE db_blog TO omrharbi;
```

### 2️⃣ Backend Setup

```bash
cd 01blog-backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:9090`

**Docker Build (Optional)**
```bash
docker build -t 01blog-backend .
docker run -p 9090:9090 01blog-backend
```

### 3️⃣ Frontend Setup

```bash
cd 01blog-frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will start on `http://localhost:4200`

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create post |
| GET | `/api/users/{id}` | Get user profile |
| POST | `/api/comments` | Add comment |
| POST | `/api/likes` | Like/unlike post |
| GET | `/api/notifications` | Get notifications |
| GET | `/api/admin/dashboard` | Admin dashboard |

## 🔒 Environment Variables

Create `application.properties` in backend:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/db_blog
spring.datasource.username=omrharbi
spring.datasource.password=omrharbi
jwt.secret=your-secret-key
jwt.expiration=86400000
file.upload-dir=./uploads
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Omar Harbi** - Talent at Zone 01 Oujda

---

Built by students, for students 🚀