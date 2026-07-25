# Movies OTT Application

> **NOTE:** The secrets provided in props and env files are just for testing purposes and serve as examples. The DB secrets are for local use and can be changed. For SMTP, the provided Username and password will not work, and emails will not be sent. Please provide your email and password of your Gmail app to experience a fully working app.

## Overview

MoviesApp is a comprehensive Internet Streaming Service Platform (OTT application) featuring a modern microservices architecture. The application provides distinct interfaces for administrators, content managers, super admins, and users, built with a robust Java Spring Boot backend and React frontends. It showcases real-world features including movie/show management, subscription/payment processing, TMDB integration, and user authentication with JWT security.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker & Deployment](#docker--deployment)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

### Core Features

- **Advanced Authentication**: JWT-based authentication with refresh token rotation, device fingerprinting, email verification, OTP validation, and password reset
- **Role-Based Access Control**: 5 roles (Super Admin, Admin, Content Manager, Support, User) with 7 permissions and role hierarchy enforcement
- **Movie & Show Management**: Complete CRUD operations with metadata, categorization, and TMDB integration
- **Subscription & Payment System**: Plan selection, email verification, payment checkout, and subscription management
- **TMDB Integration**: Search, trending, top-rated, now-playing, upcoming, discover, details, cast, similar, recommended, genres, and trailer caching
- **Watchlist**: Add/remove/check paginated watchlist per user
- **Notifications**: Real-time notification system with read/unread states
- **Admin Dashboard**: Analytics with charts, user stats, content stats, platform metrics, and system status
- **Content Manager Panel**: Specialized content management with movie/show assignment and analytics
- **Super Admin Panel**: System-level admin management with invite flow and session timeout

### Technical Features

- **Microservices Architecture**: Scalable backend with service separation
- **Database Management**: PostgreSQL with 28 Flyway migrations for version control
- **Redis Caching**: JWT blacklisting, refresh token storage, invite tokens, and trailer caching
- **Email Infrastructure**: Dual implementation (SMTP + Brevo/SendinBlue API) with Thymeleaf templates
- **API Documentation**: OpenAPI 3.0 with Swagger UI
- **Responsive Design**: Mobile-first design with Netflix-inspired UI/UX
- **Security Best Practices**: Spring Security with JWT, rate limiting, RBAC, CSP headers, and CORS configuration
- **Analytics Dashboard**: Comprehensive admin analytics with Recharts
- **Mock System**: 80+ endpoint mocks for standalone frontend development

## Tech Stack

### Backend Architecture

- **Runtime**: Java 21 with Spring Boot 3.4.5
- **Security**: Spring Security with JWT Authentication (jjwt 0.13.0), refresh token rotation, device fingerprinting
- **Database**: PostgreSQL 17 with JPA/Hibernate ORM
- **Migrations**: Flyway 28 migrations
- **Caching**: Redis for session management, JWT blacklisting, and performance
- **Email**: Spring Mail with Thymeleaf templates + Brevo SDK
- **Documentation**: OpenAPI 3.0 with SpringDoc Swagger UI
- **Testing**: JUnit 5, Mockito, TestContainers, Spring Boot Test
- **Utilities**: Lombok, DataFaker

### Frontend Architecture

#### User & Admin Interface (`frontend/`)

- **Framework**: React 19.2.7 with modern hooks
- **UI Library**: Material UI 9.2.0 + Tailwind CSS 3.4.19
- **State Management**: Redux Toolkit 2.12.0 with Redux Persist
- **Routing**: React Router DOM 7.18.1
- **HTTP Client**: Axios 1.18.1 with interceptors and auto-refresh
- **Forms**: Formik 2.4.9 with Yup validation
- **Charts**: Recharts 3.9.2
- **Animations**: Lottie React, Swiper.js
- **Icons**: MUI Icons, Lucide React, React Icons

#### Super Admin Interface (`super-admin/`)

- **Framework**: React 18.3.0 with Vite 5.3.0
- **Styling**: Tailwind CSS 3.4.4
- **Routing**: React Router DOM 6.23.0
- **HTTP Client**: Axios 1.7.0 with JWT interceptors
- **Deployment**: Vercel (static hosting)

### DevOps & Infrastructure

- **Containerization**: Docker & Docker Compose (PostgreSQL, Redis, Mailpit, Backend)
- **CI/CD**: GitHub Actions (build, test, Docker push, EC2 deploy)
- **Build Tools**: Maven for backend, npm for frontend
- **Frontend Deployment**: Vercel for super-admin

## Project Structure

```
moviesAppComplete/
├── backend/                              # Spring Boot backend (Java 21)
│   ├── src/main/java/com/naren/moviesapp/
│   │   ├── Controller/                   # REST Controllers (17 controllers)
│   │   ├── Service/                      # Business logic (20+ services)
│   │   ├── Repository/                   # Data access layer (14 repos)
│   │   ├── Entity/                       # JPA entities (14 entities)
│   │   ├── DTO/                          # Data transfer objects
│   │   ├── Security/                     # JWT & security config
│   │   ├── Exception/                    # Custom exceptions
│   │   └── Config/                       # Application configuration
│   ├── src/main/resources/
│   │   ├── db/migration/                 # 28 Flyway migrations
│   │   ├── templates/                    # Thymeleaf email templates
│   │   └── application*.yaml             # Profile configs
│   ├── src/test/                         # Unit + Integration tests
│   └── pom.xml
├── frontend/                             # User & Admin React app
│   ├── src/
│   │   ├── Pages/User/                   # User-facing pages (14 pages)
│   │   ├── Pages/Admin/                  # Admin pages (16 pages)
│   │   ├── Pages/Payment/                # Payment pages (2 pages)
│   │   ├── Components/                   # Shared components
│   │   ├── Components/Admin/             # Admin-specific components
│   │   ├── Network/                      # API calls (~50 functions)
│   │   ├── services/                     # Admin API service
│   │   ├── redux/                        # Redux store (4 slices)
│   │   ├── Utils/                        # Utilities & helpers
│   │   └── App.js                        # Routes & auth init
│   ├── public/                           # Static assets
│   └── package.json
├── super-admin/                          # Super Admin React app (Vite)
│   ├── src/
│   │   ├── pages/                        # Login, Dashboard, Invite, Admins
│   │   ├── components/                   # Layout, ProtectedRoute, SessionWarning
│   │   ├── services/                     # API service
│   │   └── authStore.js                  # In-memory token store
│   └── package.json
├── docker-compose.yaml                   # PostgreSQL + Redis + Mailpit + Backend
├── dev-start.sh                          # Local dev orchestrator
├── .env                                  # Environment variables (gitignored)
├── .env.dev                              # Dev environment (gitignored)
└── README.md
```

## Installation

### Prerequisites

- **Java**: JDK 21 or higher
- **Node.js**: Version 18+ with npm
- **Docker**: Latest version with Docker Compose
- **Maven**: Version 3.6+ for backend builds
- **Git**: For version control

### Quick Start with Docker

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/MoviesApp.git
    cd MoviesApp
    ```

2. **Start infrastructure services**:
    ```bash
    docker-compose up -d
    ```
    This starts PostgreSQL (port 5342), Redis (port 6379), and Mailpit (port 8025 for web UI)

3. **Start the backend API**:
    ```bash
    cd backend
    mvn spring-boot:run
    ```
    The API will be available at `http://localhost:8080`

4. **Start the frontend** (in a new terminal):
    ```bash
    cd frontend
    npm install
    npm start
    ```
    User/Admin interface available at `http://localhost:3000`

5. **Start the super-admin** (in another terminal):
    ```bash
    cd super-admin
    npm install
    npm run dev
    ```
    Super Admin interface available at `http://localhost:3001`

### Automated Local Dev Setup

Use the provided script to start everything at once:

```bash
./dev-start.sh
```

This will:
1. Start PostgreSQL and Redis via Docker
2. Build and start the backend
3. Start both frontend dev servers

### Manual Setup

#### Backend

1. Update the `application-dev.yaml` file with your database credentials:
    ```yaml
    spring:
      datasource:
        url: jdbc:postgresql://localhost:5342/movieott
        username: postgres
        password: password
    ```

2. Build and run the backend:
    ```bash
    cd backend
    mvn clean install
    mvn spring-boot:run
    ```

### Frontend Setup

#### User & Admin Frontend (`frontend/`)

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure environment variables** (create `.env.local` file):
    ```env
    REACT_APP_API_URL=http://localhost:8080
    REACT_APP_MOCK_MODE=false
    GENERATE_SOURCEMAP=false
    ```

4. **Start the development server**:
    ```bash
    npm start
    ```
    Access at `http://localhost:3000`

#### Super Admin Frontend (`super-admin/`)

1. **Navigate to the super-admin directory**:
    ```bash
    cd super-admin
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:3001`

#### Available Scripts

**Frontend (`frontend/`)**
- `npm start` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run build:prod` - Production build with optimizations
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

**Super Admin (`super-admin/`)**
- `npm run dev` - Start development server with Vite (port 3001)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Usage Guide

### Access Points

1. **User Interface**: `http://localhost:3000` - Browse movies/shows, manage watchlist, subscriptions
2. **Admin Panel**: `http://localhost:3000/admin/dashboard` - Manage movies, shows, users, admins, content managers
3. **Super Admin**: `http://localhost:3001/super-admin` - System-level admin management
4. **API Documentation**: `http://localhost:8080/swagger-ui.html` - Interactive API explorer
5. **Mail Pit UI**: `http://localhost:8025` - View sent emails in development

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@movies.com | ChangeMe123! |
| Demo User | demo@moviesapp.com | Demo1234567 |

### User Journey

1. **Registration**: Create account with email verification via OTP
2. **Browse**: Explore movies and shows with advanced filtering (genre, year, rating, sort)
3. **Subscribe**: Choose a plan (Monthly/6-Month/Yearly), verify email, complete payment
4. **Watch**: Full-screen video player with YouTube embeds and direct video support
5. **Watchlist**: Save content for later with one-click add/remove
6. **Profile**: Update personal info, change password, manage settings

### Admin Operations

- **Dashboard**: Overview with user stats, content stats, charts, quick actions
- **User Management**: CRUD operations, search, filter, active/inactive status
- **Movie Management**: CRUD with poster upload, genre tags, metadata
- **Show Management**: CRUD with category, type, age rating
- **Admin Management**: Invite admins, toggle status, role hierarchy
- **Content Manager Management**: Assign movies/shows, specialization checks, analytics

### Super Admin Operations

- **Dashboard**: System overview with health check, admin/user counts
- **Invite Admin**: Multi-step form with validation and email invite
- **Admins List**: Searchable list with status toggle, CSV export, resend invite
- **Session Management**: 15-minute idle timeout, 8-hour absolute timeout

## API Endpoints

### Authentication

- `POST /api/v1/auth/customers` - Register new customer
- `POST /api/v1/auth/login` - Login (Customer/Admin/ContentManager)
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout (blacklist JWT)
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/set-password` - Set password from invite token

### Email Verification

- `POST /api/v1/verify/email/exists` - Check if email exists
- `POST /api/v1/verify/email` - Send OTP to email
- `POST /api/v1/verify/email/subscription` - Send OTP for subscription
- `POST /api/v1/validate/otp` - Validate OTP

### Profile

- `GET /api/v1/profile/current` - Get current user profile
- `PUT /api/v1/profile/current` - Update profile
- `PUT /api/v1/profile/current/password` - Change password

### Movies

- `GET /api/v1/movies` - Get all movies
- `GET /api/v1/movies/{id}` - Get movie by ID
- `POST /api/v1/movies` - Create movie
- `PUT /api/v1/movies/{id}` - Update movie
- `DELETE /api/v1/movies/{id}` - Delete movie
- `GET /api/v1/movies/search` - Search movies
- `GET /api/v1/movies/category/{category}` - Movies by category
- `GET /api/v1/movies/categories` - All categories

### Shows

- `GET /api/v1/shows` - Get all shows
- `GET /api/v1/shows/{id}` - Get show by ID
- `POST /api/v1/shows` - Create show
- `PUT /api/v1/shows/{id}` - Update show
- `DELETE /api/v1/shows/{id}` - Delete show
- `GET /api/v1/shows/search` - Search shows
- `GET /api/v1/shows/category/{category}` - Shows by category

### TMDB Integration

- `GET /api/v1/tmdb/search/movies` - Search TMDB movies
- `GET /api/v1/tmdb/search/shows` - Search TMDB shows
- `GET /api/v1/tmdb/trending/movies` - Trending movies
- `GET /api/v1/tmdb/trending/shows` - Trending shows
- `GET /api/v1/tmdb/top-rated/movies` - Top rated movies
- `GET /api/v1/tmdb/now-playing/movies` - Now playing movies
- `GET /api/v1/tmdb/upcoming/movies` - Upcoming movies
- `GET /api/v1/tmdb/movie/{tmdbId}` - Movie details
- `GET /api/v1/tmdb/tv/{tmdbId}` - TV show details
- `GET /api/v1/tmdb/movie/{tmdbId}/videos` - Movie trailers
- `GET /api/v1/tmdb/movie/{tmdbId}/cast` - Movie cast
- `GET /api/v1/tmdb/movie/{tmdbId}/similar` - Similar movies
- `GET /api/v1/tmdb/genres/movies` - Movie genres

### Subscriptions & Payments

- `POST /api/v1/subscription/intent/` - Create payment intent
- `POST /api/v1/payments/submitPayment` - Process payment
- `GET /api/v1/payments/paymentDetails` - Get payment details
- `POST /api/v1/payments/subscribe-success` - Mark as subscribed

### Watchlist

- `POST /api/v1/watchlist` - Add to watchlist
- `GET /api/v1/watchlist` - Get watchlist
- `DELETE /api/v1/watchlist/{tmdbId}/{mediaType}` - Remove from watchlist
- `GET /api/v1/watchlist/check/{tmdbId}/{mediaType}` - Check if in watchlist

### Notifications

- `GET /api/v1/notifications` - Get notifications
- `GET /api/v1/notifications/unread-count` - Get unread count
- `PUT /api/v1/notifications/{id}/read` - Mark as read
- `PUT /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/{id}` - Delete notification

### Admin

- `GET /api/v1/admins` - Get all admins
- `POST /api/v1/admins` - Register admin
- `PUT /api/v1/admins/{id}/toggle-status` - Toggle admin status
- `GET /api/v1/admin/stats/users` - User registration stats
- `GET /api/v1/admin/stats/content` - Content stats

### Super Admin

- `POST /api/v1/system/superadmin/invite` - Invite new admin
- `POST /api/v1/system/superadmin/resend-invite` - Resend invite

### Health Check

- `GET /api/v1/ping` - Simple health check
- `GET /api/v1/health` - Detailed health with DB status

## Testing

### Backend Testing

The backend employs a comprehensive testing strategy using JUnit 5 and TestContainers:

```bash
# Run unit tests only
mvn test

# Run integration tests with TestContainers
mvn verify

# Run all tests with coverage report
mvn clean test jacoco:report

# Run specific test class
mvn test -Dtest=MovieServiceImplTest

# Run tests with specific profile
mvn test -Dspring.profiles.active=test
```

#### Test Structure

- **Unit Tests**: `src/test/java/com/naren/moviesapp/` - Fast, isolated component tests with Mockito
- **Integration Tests**: `src/test/java/com/naren/moviesapp/IT/` - Full-stack tests with TestContainers + PostgreSQL
- **Test Data**: `TestDataFactory` using DataFaker for realistic test data

#### Test Coverage Areas

- Services: MovieService, ShowService, CustomerService, AuthService, PaymentService, etc.
- Integration: MovieIT, CustomerIT, PaymentIT with real database
- Validation: PhoneNumberValidation tests

## Docker & Deployment

### Docker Services

The project includes infrastructure services in `docker-compose.yaml`:

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| PostgreSQL | postgres:17.6 | 5342:5432 | Primary database |
| Redis | redis:7.4 | 6379:6379 | Cache & session store |
| Mailpit | axllent/mailpit | 8025:8025 | Email testing UI |
| Backend | codenaren23/movies-api:latest | 8080:8080 | Spring Boot API |

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. **Build**: Compiles backend with JDK 21, runs `mvn clean verify`
2. **Docker**: Builds and pushes image to Docker Hub (SHA-tagged + latest)
3. **Deploy**: SSH into EC2, pulls image, recreates containers

### Production Deployment

```bash
# Build backend for production
cd backend
mvn clean package -Pprod

# Build frontend for production
cd frontend
npm run build

# Deploy with Docker Compose
docker-compose -f docker-compose.yaml up -d
```

## Development Workflow

### Local Development

```bash
# Start everything at once
./dev-start.sh

# Or start individually:
docker-compose up -d db redis    # Infrastructure
cd backend && mvn spring-boot:run  # Backend
cd frontend && npm start          # Frontend
cd super-admin && npm run dev     # Super Admin
```

### Code Quality

**Backend:**
```bash
mvn spotless:apply    # Format code
mvn checkstyle:check  # Static analysis
```

**Frontend:**
```bash
npm run lint        # ESLint
npm run lint:fix    # Auto-fix
npm run format      # Prettier
```

## Troubleshooting

### Common Issues

#### Port Conflicts

```bash
lsof -i :8080  # Backend
lsof -i :3000  # Frontend
lsof -i :3001  # Super Admin
lsof -i :5342  # PostgreSQL
lsof -i :6379  # Redis
```

#### Database Connection Issues

```bash
docker ps | grep postgres
docker-compose restart db
docker-compose logs db
psql -h localhost -p 5342 -U postgres -d movieott
```

#### Redis Connection Issues

```bash
docker ps | grep redis
redis-cli -h localhost -p 6379 ping
redis-cli -h localhost -p 6379 flushall
```

#### Backend Won't Start

```bash
# Check if PostgreSQL is ready
docker exec postgres-mv pg_isready -U postgres

# Check application logs
docker-compose logs app

# Verify Flyway migrations
mvn flyway:migrate
```

### Debug Mode

```yaml
# Add to application-dev.yaml
logging:
  level:
    com.naren.moviesapp: DEBUG
    org.springframework.security: DEBUG
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make changes and test
4. Commit with conventional format (`feat:`, `fix:`, `docs:`, etc.)
5. Push and create a Pull Request

## Contact

- **Email**: [naren06251999@gmail.com](mailto:naren06251999@gmail.com)
- **GitHub**: [GitHub Issues](https://github.com/yourusername/MoviesApp/issues)

---

**Version**: 2.0.0
**Last Updated**: 2025
