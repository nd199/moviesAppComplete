# MoviesAppComplete

MoviesApp is an example of an Internet Streaming service Platform (OTT application). The application features a user-friendly interface for both admins and users. It is built with a Java Spring backend and a React frontend.

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

## Tech Stack
- **Backend:** Java Spring
- **Frontend:** React
- **Database:** PostgreSQL (or your preferred SQL database)
- **Authentication:** JWT (JSON Web Tokens) for registration and login

## Installation

### Prerequisites
- Java 11 or higher
- Node.js and npm
- PostgreSQL (or your preferred SQL database)

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

## Usage
1. Open your browser and go to `http://localhost:3000` for the user interface.
2. Open your browser and go to `http://localhost:3006` for the admin interface.
3. Register a new account or log in with an existing account.
4. As an admin, you can access the admin dashboard to manage movies, shows as products and users and screenings.
5. As an user, you can browse available movies and make bookings.


## API Endpoints
### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Movies
- `GET /api/movies` - Get a list of all movies
- `POST /api/movies` - Add a new movie (admin only)
- `PUT /api/movies/{id}` - Update a movie (admin only)
- `DELETE /api/movies/{id}` - Delete a movie (admin only)

### Bookings
- `GET /api/bookings` - Get a list of all bookings (admin only)
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/{id}` - Cancel a booking

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Contact
For any inquiries or issues, or to contribute, please contact [naren06251999@gmail.com](mailto:naren06251999@gmail.com).
