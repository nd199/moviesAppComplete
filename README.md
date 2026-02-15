# Movies OTT Application

### NOTE: The secrets provided in props and env files are just for testing purposes and serve as examples. The DB secrets are for local use and can be changed. For SMTP, the provided Username and password will not work, and emails will not be sent. Please provide your email and password of your Gmail app to experience a fully working app.




# App Screenshots
(Screenshots removed - Firebase storage URLs deprecated)

MoviesApp is an example of an Internet Streaming Service Platform (OTT application). The application features a user-friendly interface for both admins and users. It is built with a Java Spring backend and a React frontend. The application also utilizes a microservices architecture, with separate services for handling user/admin operations and payment processing, which communicate via APIs.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Contact](#contact)

## Features
- User authentication and authorization
- Admin dashboard for managing movies, screenings, and bookings
- User dashboard for browsing and booking movies
- Responsive design with a Netflix-inspired theme
- Smooth navigation with redirects upon registration, login, and logout
- Payment processing module using Spring Boot and PostgreSQL
- Microservices architecture with communication via APIs

## Tech Stack
- **Backend:** Java 17, Spring Boot 3.2.12, Spring Security, JWT Authentication
- **Frontend:** React 19.2.4, Redux Toolkit, Material-UI, React Router
- **Database:** PostgreSQL with Flyway migrations
- **Cache:** Redis for session management
- **Build Tools:** Maven for backend, npm for frontend
- **Containerization:** Docker and Docker Compose
- **Email:** Spring Mail with SendGrid integration
- **Testing:** JUnit 5, TestContainers, React Testing Library

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
### Authentication(Spring backend)
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Log in a user

### Movies(Spring backend)
- `GET /api/v1/movies` - Get a list of all movies
- `POST /api/v1/movies` - Add a new movie (admin only)
- `PUT /api/v1/movies/{id}` - Update a movie (admin only)
- `DELETE /api/v1/movies/{id}` - Delete a movie (admin only)

### Bookings(Spring backend)
- `GET /api/v1/users` - Get a list of all users (admin only)
- `GET /api/v1/products` - Create a new product (Under development)
- `POST /api/v1/products` - Add a new product (Movie or Show)
- `DELETE /api/v1/bookings/{id}` - Delete a product (Movie or Show)

### Payments(Spring backend)
- `POST /api/v1/payments/submitPayment` - Process a payment
- `GET /api/v1/payments/paymentDetails` - Get payment details

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Contact
For any inquiries or issues, or to contribute, please contact [naren06251999@gmail.com](mailto:naren06251999@gmail.com).
