# Movies OTT Application

### NOTE: The secrets provided in props and env files are just for testing purposes and serve as examples. The DB secrets are for local use and can be changed. For SMTP, the provided Username and password will not work, and emails will not be sent. Please provide your email and password of your Gmail app to experience a fully working app.




# App Screenshots

MoviesApp is an example of an Internet Streaming Service Platform (OTT application). The application features a user-friendly interface for both admins and users. It is built with a Java Spring backend and a React frontend. The application also utilizes a microservices architecture, with separate services for handling user/admin operations and payment processing, which communicate via APIs.

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
- User authentication and authorization with JWT
- Admin dashboard for managing movies, screenings, and bookings
- User dashboard for browsing and booking movies
- Responsive design with a Netflix-inspired theme
- Smooth navigation with redirects upon registration, login, and logout
- Payment processing module using Spring Boot and PostgreSQL
- Microservices architecture with communication via APIs
- Email verification and password reset functionality
- Redis caching for session management
- Subscription management system
- Real-time notifications with WebSocket support
- Image upload functionality with ImgBB integration
- Advanced filtering and search capabilities
- User role-based access control (Admin/User)

## Tech Stack
- **Backend:** Java 17, Spring Boot 3.2.12, Spring Security, JWT Authentication
- **Frontend:** React 19.2.4, Redux Toolkit, Material-UI, React Router, Axios
- **Database:** PostgreSQL with Flyway migrations, H2 for testing
- **Cache:** Redis for session management
- **Build Tools:** Maven for backend, npm for frontend
- **Containerization:** Docker and Docker Compose, Jib for containerization
- **Email:** Spring Mail with SendGrid integration
- **Testing:** JUnit 5, TestContainers, React Testing Library, Jest
- **Other:** Lombok, JavaFaker, Thymeleaf, WebFlux (test)

## Project Structure

```
moviesAppComplete/
├── backend/
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
├── movies-frontend/
│   ├── src/
│   │   ├── Components/                  # React components
│   │   ├── Pages/                       # Page components
│   │   ├── Network/                     # API calls
│   │   ├── Utils/                       # Utility functions
│   │   ├── redux/                       # Redux store
│   │   └── animations/                  # Animation assets
│   ├── public/                          # Static assets
│   └── package.json                     # npm configuration
├── docker-compose.yaml                  # Docker services
└── README.md                           # This file
```

## Installation

### Prerequisites
- Java 17 or higher
- Node.js 18+ and npm
- Docker and Docker Compose
- Maven 3.6+

### Quick Start with Docker
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/MoviesApp.git
    cd MoviesApp
    ```

2. Start the database services:
    ```bash
    docker-compose up -d
    ```

3. Start the backend:
    ```bash
    cd backend
    mvn spring-boot:run
    ```

4. Start the frontend (in a new terminal):
    ```bash
    cd movies-frontend
    npm install
    npm start
    ```

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

### Frontend
1. Navigate to the frontend directory:
    ```bash
    cd movies-frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

#### Available Scripts
- `npm start` - Start development server on port 3000
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Usage
1. Open your browser and go to `http://localhost:3000` for the user interface.
2. Register a new account or log in with an existing account.
3. As an admin, you can access the admin dashboard to manage movies, shows as products, users, and screenings.
4. As a user, you can browse available movies and make bookings.
5. Use the payment interface for processing payments.

### API Documentation
Once the backend is running, you can access the interactive API documentation:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`
- **Swagger UI with custom path:** `http://localhost:8080/swagger-ui/index.html`

The API documentation includes:
- Interactive testing of all endpoints
- Request/response schemas
- Authentication with JWT tokens
- Detailed parameter descriptions

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

#### Frontend (.env)
Create a `.env` file in the movies-frontend directory:
```env
REACT_APP_API_URL=http://localhost:8080
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

## Testing

### Backend Testing
The backend uses JUnit 5 and TestContainers for comprehensive testing:

#### Running Tests
```bash
# Run unit tests only
mvn test

# Run integration tests
mvn verify

# Run all tests with coverage
mvn clean test jacoco:report
```

#### Test Structure
- **Unit Tests:** Located in `src/test/java/com/naren/moviesapp/`
- **Integration Tests:** Located in `src/test/java/com/naren/moviesapp/IT/`
- **TestContainers:** Used for database integration testing
- **H2 Database:** Used for in-memory testing

#### Test Coverage
- Controllers: REST API endpoint testing
- Services: Business logic testing
- Repositories: Data access layer testing
- Security: Authentication and authorization testing

### Frontend Testing
The frontend uses React Testing Library and Jest:

#### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Docker & Deployment

### Docker Services
The project includes two main services in `docker-compose.yaml`:
- **PostgreSQL Database:** Port 5332
- **Redis Cache:** Port 6379

### Containerization with Jib
The backend uses Google Jib for containerization:

```bash
# Build Docker image
mvn jib:build

# Build to local Docker daemon
mvn jib:dockerBuild
```

### Production Deployment
1. **Environment Setup:**
   - Configure production database in `application-prod.yaml`
   - Set up production Redis instance
   - Configure email service credentials

2. **Build & Deploy:**
   ```bash
   # Build backend
   mvn clean package -Pprod
   
   # Build frontend
   cd movies-frontend
   npm run build:prod
   
   # Deploy with Docker
   docker-compose -f docker-compose.prod.yaml up -d
   ```

## Development Workflow

### Code Quality Tools

#### Backend
```bash
# Format code with Maven
mvn spotless:apply

# Run static analysis
mvn checkstyle:check

# Generate documentation
mvn javadoc:javadoc
```

#### Frontend
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Security audit
npm run security-check
```

### Pre-commit Hooks
The project includes pre-commit hooks for code quality:
- ESLint and Prettier for frontend
- Test validation for both frontend and backend
- Security checks

### Development Scripts
```bash
# Clean build artifacts
npm run clean

# Analyze bundle size
npm run analyze

# Development mode without browser
npm run dev
```

## Troubleshooting

### Common Issues

#### Port Conflicts
- **Backend:** Default port 8080 (configurable via `server.port`)
- **Frontend:** Default port 3000
- **Database:** PostgreSQL on 5332, Redis on 6379

#### Database Connection Issues
```bash
# Check PostgreSQL container
docker ps | grep postgres

# Restart database services
docker-compose restart db

# Check logs
docker-compose logs db
```

#### Redis Connection Issues
```bash
# Check Redis container
docker ps | grep redis

# Test Redis connection
redis-cli -h localhost -p 6379 ping
```

#### JWT Token Issues
- Ensure `JWT_SECRET` is configured in `application-dev.yaml`
- Check token expiration settings
- Verify token format in browser dev tools

#### Email Service Issues
- Configure Gmail App Password for SMTP
- Check SendGrid API keys if using SendGrid
- Verify email templates in `resources/templates/`

### Debug Mode
Enable debug logging by adding to `application-dev.yaml`:
```yaml
logging:
  level:
    com.naren.moviesapp: DEBUG
    org.springframework.security: DEBUG
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Contact
For any inquiries or issues, or to contribute, please contact [naren06251999@gmail.com](mailto:naren06251999@gmail.com).
