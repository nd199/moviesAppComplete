# MoviesAppComplete

### NOTE: The secrets provided in props and env files are just for testing purposes and serve as examples. The DB secrets are for local use and can be changed. For SMTP, the provided Username and password will not work, and emails will not be sent. Please provide your email and password of your Gmail app to experience a fully working app.

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
- Payment processing module using Node.js and MongoDB
- Microservices architecture with communication via APIs

## Tech Stack
- **Backend:** Java Spring Boot
- **Frontend:** React And Redux Toolkit
- **Database:** PostgreSQL (user/admin data) Springboot Backend, MongoDB (payment data) Node backend
- **Authentication:** JWT (JSON Web Tokens) for registration and login
- **UUIDTOKEN:** Changing-Password Email Verification
- **Payment Processing Backend:** Node.js

## Installation

### Prerequisites
- Java 11 or higher (var keywords are used)
- Node.js and npm
- PostgreSQL (or your preferred database)
- MongoDB (or your preferred database)

### Backend
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/MoviesApp.git
    cd MoviesApp/backend
    ```

2. Update the `application.properties` file with your database credentials:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5332/moviesapp
    spring.datasource.username=yourusername
    spring.datasource.password=yourpassword
    ```

3. Build and run the backend:
    ```bash
    ./mvnw clean install
    ./mvnw spring-boot:run
    ```

### Frontend (User)
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

### Frontend (Admin)
1. Navigate to the admin directory:
    ```bash
     cd frontendAdmin
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

### Payment Module
1. Navigate to the payment module directory:
    ```bash
    cd paymentModule
    ```

2. Update the `config.js` file with your MongoDB URI:
    ```javascript
    module.exports = {
        mongoURI: 'mongodb://yourusername:yourpassword@localhost:27017/movie_payment?authSource=admin'
    };
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Start the payment server:
    ```bash
    npm start
    ```

## Usage
1. Open your browser and go to `http://localhost:3000` for the user interface.
2. Open your browser and go to `http://localhost:3006` for the admin interface.
3. Register a new account or log in with an existing account.
4. As an admin, you can access the admin dashboard to manage movies, shows as products, users, and screenings.
5. As a user, you can browse available movies and make bookings.
6. Use the payment interface for processing payments.

## API Endpoints
### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Log in a user

### Movies
- `GET /api/v1/movies` - Get a list of all movies
- `POST /api/v1/movies` - Add a new movie (admin only)
- `PUT /api/v1/movies/{id}` - Update a movie (admin only)
- `DELETE /api/v1/movies/{id}` - Delete a movie (admin only)

### Bookings
- `GET /api/v1/users` - Get a list of all bookings (admin only)
- `GET /api/v1/products` - Create a new booking
- `POST /api/v1/products` - Add a new product (Movie or Show)
- `DELETE /api/v1/bookings/{id}` - Delete a product (Movie or Show)

### Payments
- `POST /api/v1/payments` - Process a payment
- `GET /api/v1/payments/{id}` - Get payment details

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Contact
For any inquiries or issues, or to contribute, please contact [naren06251999@gmail.com](mailto:naren06251999@gmail.com).
