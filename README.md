# Movies OTT Application

### NOTE: The secrets provided in props and env files are just for testing purposes and serve as examples. The DB secrets are for local use and can be changed. For SMTP, the provided Username and password will not work, and emails will not be sent. Please provide your email and password of your Gmail app to experience a fully working app.

## 🎬 Overview

MoviesApp is a comprehensive Internet Streaming Service Platform (OTT application) featuring a modern microservices architecture. The application provides distinct interfaces for administrators and users, built with a robust Java Spring Boot backend and React frontends. It showcases real-world features including movie management, booking systems, payment processing, and user authentication with JWT security.

## 📸 Application Screenshots

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

## 🚀 Features

### 🎯 Core Features
- **🔐 Advanced Authentication**: JWT-based authentication with email verification and password reset
- **👥 Role-Based Access Control**: Separate interfaces for Admins and Users with appropriate permissions
- **🎥 Movie Management**: Complete CRUD operations for movies with metadata and categorization
- **📅 Show & Screening Management**: Schedule and manage movie screenings with time slots
- **🎫 Booking System**: User-friendly booking interface with seat selection and confirmation
- **💳 Payment Processing**: Secure payment integration with transaction history
- **📧 Email Notifications**: Automated emails for booking confirmations, registration, and password resets
- **🔍 Advanced Search & Filtering**: Find movies by title, genre, language, and more

### 🛠️ Technical Features
- **⚡ Microservices Architecture**: Scalable backend with service separation
- **🗄️ Database Management**: PostgreSQL with Flyway migrations for version control
- **🚀 Redis Caching**: High-performance session management and data caching
- **📊 Real-time Updates**: WebSocket support for live notifications
- **🖼️ Image Upload**: ImgBB integration for movie posters and assets
- **📱 Responsive Design**: Mobile-first design with Netflix-inspired UI/UX
- **🔒 Security Best Practices**: Spring Security with JWT tokens and CORS configuration
- **📈 Analytics Dashboard**: Comprehensive admin analytics with charts and metrics

## 🛠️ Tech Stack

### Backend Architecture
- **🟢 Runtime**: Java 17 with Spring Boot 3.2.12
- **🔐 Security**: Spring Security with JWT Authentication (jjwt 0.13.0)
- **🗄️ Database**: PostgreSQL with JPA/Hibernate ORM
- **🔄 Migrations**: Flyway for database version control
- **⚡ Caching**: Redis for session management and performance
- **📧 Email**: Spring Mail with Thymeleaf templates
- **📚 Documentation**: OpenAPI 3.0 with Swagger UI
- **🧪 Testing**: JUnit 5, TestContainers, Spring Boot Test
- **🔧 Utilities**: Lombok for boilerplate reduction, JavaFaker for test data

### Frontend Architecture

#### User Interface (movies-user)
- **⚛️ Framework**: React 18.2.0 with modern hooks
- **🎨 UI Library**: Material-UI 7.3.8 with custom theming
- **🔄 State Management**: Redux Toolkit 2.11.2 with Redux Persist
- **🛣️ Routing**: React Router DOM 7.13.0
- **📡 HTTP Client**: Axios 1.13.5 with interceptors
- **🎭 Animations**: Lottie React, React Slick, Swiper.js
- **📊 Charts**: Recharts 3.7.0 for data visualization
- **✅ Forms**: Formik 2.4.9 with Yup validation

#### Admin Interface (movies-admin)
- **⚡ Build Tool**: Vite 7.3.1 for fast development
- **🎨 UI Components**: Tailwind CSS with Heroicons
- **🔄 State Management**: Redux Toolkit for predictable state
- **📊 Analytics**: Recharts for admin dashboard metrics

### DevOps & Infrastructure
- **🐳 Containerization**: Docker & Docker Compose
- **🏗️ Build Tools**: Maven for backend, npm for frontend
- **📦 Image Building**: Google Jib for optimized Docker images
- **🔍 Code Quality**: ESLint, Prettier, Maven Checkstyle
- **🧪 Test Containers**: Integration testing with real databases

## Project Structure

```
moviesAppComplete/
├── backend/                              # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   └── java/com/naren/moviesapp/
│   │   │       ├── Controller/          # REST Controllers
│   │   │       ├── Service/             # Business logic
│   │   │       ├── Repository/          # Data access layer
│   │   │       ├── Entity/              # JPA entities
│   │   │       ├── DTO/                 # Data transfer objects
│   │   │       ├── Exception/           # Custom exceptions
│   │   │       ├── Security/            # JWT & security config
│   │   │       └── Utils/               # Utility classes
│   │   └── test/                        # Test classes
│   └── pom.xml                          # Maven configuration
├── movies-user/                          # User frontend (React)
│   ├── src/
│   │   ├── Components/                  # React components
│   │   ├── Pages/                       # Page components
│   │   ├── Network/                     # API calls
│   │   ├── Utils/                       # Utility functions
│   │   └── redux/                       # Redux store
│   ├── public/                          # Static assets
│   ├── package.json                     # npm configuration
│   └── .env                             # Environment variables
├── movies-admin/                         # Admin frontend (React)
│   ├── src/
│   │   ├── Components/                  # React components
│   │   ├── Pages/                       # Page components
│   │   ├── Network/                     # API calls
│   │   └── Utils/                       # Utility functions
│   ├── public/                          # Static assets
│   └── package.json                     # npm configuration
├── docker-compose.yaml                  # Docker services
├── .gitignore                           # Git ignore rules
└── README.md                           # This file
```

## Installation

### 🎯 Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: Version 18+ with npm
- **Docker**: Latest version with Docker Compose
- **Maven**: Version 3.6+ for backend builds
- **Git**: For version control

### 🚀 Quick Start with Docker

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/MoviesApp.git
    cd MoviesApp
    ```

2. **Start infrastructure services**:
    ```bash
    docker-compose up -d
    ```
    This starts PostgreSQL (port 5332) and Redis (port 6379)

3. **Start the backend API**:
    ```bash
    cd backend
    mvn spring-boot:run
    ```
    The API will be available at `http://localhost:8080`

4. **Start the user frontend** (in a new terminal):
    ```bash
    cd movies-user
    npm install
    npm start
    ```
    User interface available at `http://localhost:3000`

5. **Start the admin frontend** (in another new terminal):
    ```bash
    cd movies-admin
    npm install
    npm run dev
    ```
    Admin interface available at `http://localhost:5173`

### Manual Setup

#### Backend
1. Update the `application-dev.yaml` file with your database credentials:
    ```yaml
    spring:
      datasource:
        url: jdbc:postgresql://localhost:5332/movieott
        username: codeNaren
        password: password
    ```

2. Build and run the backend:
    ```bash
    cd backend
    mvn clean install
    mvn spring-boot:run
    ```

### Frontend Setup

#### 🎬 User Frontend
1. **Navigate to the user frontend directory**:
    ```bash
    cd movies-user
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure environment variables** (create `.env` file):
    ```env
    REACT_APP_API_URL=http://localhost:8080/api/v1
    REACT_APP_IMGBB_API_KEY=your_imgbb_api_key
    GENERATE_SOURCEMAP=false
    ```

4. **Start the development server**:
    ```bash
    npm start
    ```
    Access at `http://localhost:3000`

#### ⚙️ Admin Frontend
1. **Navigate to the admin frontend directory**:
    ```bash
    cd movies-admin
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure environment variables** (create `.env` file):
    ```env
    VITE_API_URL=http://localhost:8080/api/v1
    ```

4. **Start the development server**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:5173`

> **Note**: Admin interface documentation is pending and will be updated soon.

#### 🛠️ Available Scripts

**User Frontend (movies-user)**
- `npm start` - Start development server on port 3000
- `npm run build` - Build for production
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size
- `npm run security-check` - Run npm audit for vulnerabilities
- `npm run clean` - Clean build artifacts
- `npm run dev` - Development mode without browser

**Admin Frontend (movies-admin)**
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎮 Usage Guide

### 🌐 Access Points
1. **User Interface**: `http://localhost:3000` - Browse movies, book tickets, manage profile
2. **Admin Interface**: `http://localhost:5173` - Manage movies, shows, users, and analytics
3. **API Documentation**: `http://localhost:8080/swagger-ui.html` - Interactive API explorer

### 📱 User Journey
1. **Registration**: Create account with email verification
2. **Browse Movies**: Explore catalog with advanced filtering
3. **Book Tickets**: Select shows, choose seats, process payment
4. **Manage Bookings**: View history, cancel bookings, download tickets
5. **Profile Management**: Update personal information, preferences

### ⚙️ Admin Operations
> **Admin interface documentation is pending** - Full admin features documentation coming soon

Basic admin capabilities include:
- Movie management (CRUD operations)
- Show scheduling and management
- User management and analytics
- Booking oversight and reporting
- Payment transaction monitoring

### 📚 API Documentation

Once the backend is running, access comprehensive API documentation:

- **🎯 Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **📄 OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **🔍 Alternative UI**: `http://localhost:8080/swagger-ui/index.html`

#### Documentation Features
- **Interactive Testing**: Try all endpoints directly from your browser
- **🔐 Authentication**: JWT token-based security with examples
- **📋 Request/Response Schemas**: Detailed data models and examples
- **📝 Parameter Documentation**: Complete parameter descriptions and constraints
- **🏷️ Tagged Endpoints**: Organized by functional areas (Auth, Movies, Bookings, etc.)

### Environment Variables
#### Backend (application-dev.yaml)
- `DB_URL` - Database connection URL (default: jdbc:postgresql://localhost:5332/movieott)
- `DB_USERNAME` - Database username (default: codeNaren)
- `DB_PASSWORD` - Database password (default: password)
- `JWT_SECRET` - JWT secret key for authentication
- `MAIL_HOST` - SMTP server host (default: smtp.gmail.com)
- `MAIL_USERNAME` - Email username for notifications
- `MAIL_PASSWORD` - Email app password
- `REDIS_HOST` - Redis server host (default: localhost)
- `REDIS_PORT` - Redis server port (default: 6379)

#### Frontend Environment Variables

**User Frontend (.env in movies-user/)**
```env
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_IMGBB_API_KEY=your_imgbb_api_key
GENERATE_SOURCEMAP=false
```

**Admin Frontend (.env in movies-admin/)**
```env
REACT_APP_API_URL=http://localhost:8080/api/v1
GENERATE_SOURCEMAP=false
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Log in a user
- `POST /api/v1/auth/verify-email` - Verify email address
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Users & Customers
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/{id}` - Get user by ID
- `PUT /api/v1/users/{id}` - Update user profile
- `DELETE /api/v1/users/{id}` - Delete user (admin only)

### Movies Management
- `GET /api/v1/movies` - Get all movies with pagination
- `GET /api/v1/movies/{id}` - Get movie by ID
- `POST /api/v1/movies` - Add new movie (admin only)
- `PUT /api/v1/movies/{id}` - Update movie (admin only)
- `DELETE /api/v1/movies/{id}` - Delete movie (admin only)
- `GET /api/v1/movies/search` - Search movies by title/genre

### Shows & Screenings
- `GET /api/v1/shows` - Get all shows
- `GET /api/v1/shows/{id}` - Get show by ID
- `POST /api/v1/shows` - Create new show (admin only)
- `PUT /api/v1/shows/{id}` - Update show (admin only)
- `DELETE /api/v1/shows/{id}` - Delete show (admin only)

### Bookings
- `GET /api/v1/bookings` - Get user bookings
- `GET /api/v1/bookings/{id}` - Get booking by ID
- `POST /api/v1/bookings` - Create new booking
- `DELETE /api/v1/bookings/{id}` - Cancel booking
- `GET /api/v1/bookings/user/{userId}` - Get bookings by user

### Payments
- `POST /api/v1/payments/submitPayment` - Process payment
- `GET /api/v1/payments/paymentDetails` - Get payment details
- `GET /api/v1/payments/{id}` - Get payment by ID
- `POST /api/v1/payments/refund` - Process refund

### Subscriptions
- `GET /api/v1/subscriptions` - Get available subscriptions
- `POST /api/v1/subscriptions/subscribe` - Subscribe to plan
- `GET /api/v1/subscriptions/user` - Get user subscription
- `PUT /api/v1/subscriptions/cancel` - Cancel subscription

### Utility
- `GET /api/v1/ping` - Health check endpoint
- `GET /api/v1/actuator/health` - Spring Boot health check

## 🧪 Testing

### 🔧 Backend Testing

The backend employs a comprehensive testing strategy using JUnit 5 and TestContainers:

#### 🚀 Running Tests
```bash
# Run unit tests only
mvn test

# Run integration tests with TestContainers
mvn verify

# Run all tests with coverage report
mvn clean test jacoco:report

# Run specific test class
mvn test -Dtest=MovieServiceTest

# Run tests with specific profile
mvn test -Dspring.profiles.active=test
```

#### 📁 Test Structure
- **Unit Tests**: `src/test/java/com/naren/moviesapp/` - Fast, isolated component tests
- **Integration Tests**: `src/test/java/com/naren/moviesapp/IT/` - Full-stack tests with real database
- **TestContainers**: Database integration testing with PostgreSQL containers
- **H2 In-Memory**: Fast unit testing without external dependencies

#### 🎯 Test Coverage Areas
- **Controllers**: REST API endpoint testing with MockMvc
- **Services**: Business logic testing with Mockito
- **Repositories**: Data access layer testing
- **Security**: JWT authentication and authorization testing
- **Exception Handling**: Custom exception and error response testing

### ⚛️ Frontend Testing

Modern React testing using React Testing Library and Jest:

#### 🚀 Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode for development
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run tests matching a pattern
npm test -- --testNamePattern="MovieComponent"

# Run tests and update snapshots
npm test -- --updateSnapshot
```

#### 📊 Coverage Reports
- **Statement Coverage**: Code execution coverage
- **Branch Coverage**: Conditional logic coverage
- **Function Coverage**: Function invocation coverage
- **Line Coverage**: Source line coverage

#### 🧪 Test Types
- **Component Testing**: Individual React component testing
- **Integration Testing**: Component interaction testing
- **Hook Testing**: Custom React hook testing
- **Redux Testing**: State management testing
- **API Testing**: Mocked API call testing

## 🐳 Docker & Deployment

### 🏗️ Docker Services

The project includes essential infrastructure services in `docker-compose.yaml`:

#### 📊 PostgreSQL Database
- **Container**: `postgres-mv`
- **Port**: 5332 (mapped from container 5432)
- **Database**: `movieott`
- **Credentials**: `codeNaren/password`
- **Persistence**: Docker volume for data persistence
- **Health Check**: Automated health monitoring

#### ⚡ Redis Cache
- **Container**: `redis-mv`
- **Port**: 6379
- **Purpose**: Session management and caching
- **Restart Policy**: `unless-stopped`

### 📦 Containerization with Google Jib

Optimized Docker image building for Spring Boot applications:

```bash
# Build and push to registry
mvn jib:build

# Build to local Docker daemon
mvn jib:dockerBuild

# Build with custom tag
mvn jib:dockerBuild -Djib.to.tags=my-tag
```

#### 🎯 Jib Configuration Benefits
- **Layer Optimization**: Efficient layer caching for faster builds
- **Minimal Base Image**: Eclipse Temurin JRE 17 for smaller images
- **JVM Tuning**: Optimized JVM flags for production
- **Multi-platform**: AMD64 Linux support

### 🚀 Production Deployment

#### 1️⃣ Environment Preparation
```bash
# Configure production database
# Update application-prod.yaml with production credentials

# Set up production Redis instance
# Configure Redis connection settings

# Configure email service
# Set up SMTP or SendGrid credentials
```

#### 2️⃣ Build & Deploy Process
```bash
# Build backend for production
cd backend
mvn clean package -Pprod

# Build user frontend for production
cd ../movies-user
npm run build:prod

# Build admin frontend for production
cd ../movies-admin
npm run build

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yaml up -d
```

#### 🔧 Production Considerations
- **Environment Variables**: Use `.env` files for sensitive data
- **SSL/TLS**: Configure HTTPS with proper certificates
- **Monitoring**: Set up application monitoring and logging
- **Backup**: Regular database backups and recovery procedures
- **Scaling**: Consider load balancers for high availability

## 🔄 Development Workflow

### 🛠️ Code Quality Tools

#### 🔧 Backend Quality Assurance
```bash
# Format code with Spotless
mvn spotless:apply

# Run static analysis with Checkstyle
mvn checkstyle:check

# Generate Javadoc documentation
mvn javadoc:javadoc

# Run dependency analysis
mvn dependency:analyze

# Check for security vulnerabilities
mvn dependency-check:check
```

#### ⚛️ Frontend Quality Assurance
```bash
# Run ESLint for code quality
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Run security audit
npm run security-check

# Analyze bundle size
npm run analyze
```

### 🪝 Pre-commit Hooks

Automated quality checks before commits:
- **ESLint & Prettier**: Frontend code formatting and linting
- **Test Validation**: Ensure all tests pass before commit
- **Security Checks**: Automated vulnerability scanning
- **Build Verification**: Ensure applications build successfully

### 🚀 Development Scripts

#### 🎬 User Frontend Scripts
```bash
# Clean build artifacts and cache
npm run clean

# Analyze webpack bundle size
npm run analyze

# Development mode without browser auto-open
npm run dev

# Production build with optimizations
npm run build:prod
```

#### ⚙️ Admin Frontend Scripts
```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Code quality checks
npm run lint
```

## 🔧 Troubleshooting

### 🚨 Common Issues & Solutions

#### 🔌 Port Conflicts
```bash
# Check what's running on ports
lsof -i :8080  # Backend
lsof -i :3000  # User Frontend
lsof -i :5173  # Admin Frontend
lsof -i :5332  # PostgreSQL
lsof -i :6379  # Redis

# Kill processes on specific ports
kill -9 <PID>
```

**Default Ports:**
- **Backend API**: 8080 (configurable via `server.port`)
- **User Frontend**: 3000
- **Admin Frontend**: 5173 (Vite default)
- **PostgreSQL**: 5332
- **Redis**: 6379

#### 🗄️ Database Connection Issues
```bash
# Check PostgreSQL container status
docker ps | grep postgres

# Restart database services
docker-compose restart db

# View database logs
docker-compose logs db

# Test database connection
psql -h localhost -p 5332 -U codeNaren -d movieott

# Run database migrations
mvn flyway:migrate
```

#### ⚡ Redis Connection Issues
```bash
# Check Redis container status
docker ps | grep redis

# Test Redis connection
redis-cli -h localhost -p 6379 ping

# View Redis logs
docker-compose logs db_message

# Clear Redis cache
redis-cli -h localhost -p 6379 flushall
```

#### 🔐 JWT Authentication Issues
```bash
# Check JWT configuration in application-dev.yaml
grep -r "JWT_SECRET" src/main/resources/

# Verify token format (should be Bearer <token>)
# Check browser dev tools > Application > Local Storage
```

**Common JWT Problems:**
- Missing `JWT_SECRET` in configuration
- Token expiration (default 24 hours)
- Incorrect token format in headers
- CORS configuration blocking requests

#### 📧 Email Service Issues
```bash
# Test email configuration
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check email templates
ls -la src/main/resources/templates/
```

**Email Setup Checklist:**
- Configure Gmail App Password (not regular password)
- Enable 2-factor authentication on Gmail
- Check SMTP settings in `application-dev.yaml`
- Verify email templates exist and are properly formatted

### 🐛 Debug Mode

Enable comprehensive debug logging:

```yaml
# Add to application-dev.yaml
logging:
  level:
    com.naren.moviesapp: DEBUG
    org.springframework.security: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### 🔍 Performance Monitoring

```bash
# Monitor application resources
top -p $(pgrep java)  # Backend process
npm run analyze        # Frontend bundle analysis

# Check memory usage
jstat -gc $(pgrep java)  # JVM garbage collection stats

# Database performance
psql -h localhost -p 5332 -U codeNaren -d movieott -c "SELECT * FROM pg_stat_activity;"
```

## 🤝 Contributing

We welcome contributions! Please follow our comprehensive contribution guidelines:

### 📋 Contribution Process
1. **🍴 Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/MoviesApp.git
   cd MoviesApp
   ```

2. **🌿 Create Feature Branch**
   ```bash
   git checkout -b feature/your-amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **🔧 Development Setup**
   ```bash
   # Install dependencies
   docker-compose up -d
   cd backend && mvn clean install
   cd ../movies-user && npm install
   cd ../movies-admin && npm install
   ```

4. **✅ Make Changes & Test**
   ```bash
   # Run all tests
   cd backend && mvn test
   cd ../movies-user && npm test
   cd ../movies-admin && npm run lint
   ```

5. **📝 Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature description"
   ```

6. **🚀 Push & Create Pull Request**
   ```bash
   git push origin feature/your-amazing-feature
   # Create PR on GitHub with detailed description
   ```

### 📝 Commit Message Guidelines
Use conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code formatting changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

### 🧪 Testing Requirements
- All new features must include tests
- Maintain minimum 80% test coverage
- Ensure all existing tests pass
- Add integration tests for API changes

### 📖 Code Review Process
- All PRs require at least one approval
- Automated checks must pass
- Follow existing code style and patterns
- Update documentation for API changes

### 🐛 Bug Reports
Use GitHub Issues with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Relevant logs/screenshots

## 📞 Contact & Support

### 🤝 Get in Touch

For any inquiries, issues, or contributions, please reach out:

- **📧 Email**: [naren06251999@gmail.com](mailto:naren06251999@gmail.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/MoviesApp/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/MoviesApp/discussions)

### 🙏 Acknowledgments

Special thanks to the open-source community and contributors who make this project possible.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⭐ If you find this project helpful, please give it a star on GitHub!**

**🔄 Last Updated**: 2025

**🚀 Version**: 1.0.0
