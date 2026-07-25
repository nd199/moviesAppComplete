# Movies OTT Platform

A full-stack OTT streaming platform with **30 Flyway migrations**, **150+ REST endpoints**, **5 user roles**, and **3 separate frontend applications** — built with Spring Boot 3.4, React 19, PostgreSQL, and Redis.

**Live Backend API**: `https://nmoviesapi.duckdns.org`  
**Frontend**: `https://movies-app-complete.vercel.app`  
**Super Admin**: deployed on Vercel

---

## Features

### Authentication & Security
- JWT access + refresh token rotation with device fingerprinting
- Email verification via OTP (6-digit code)
- Password reset flow with time-limited tokens
- Rate limiting: 5 failed attempts → 15 min lockout, 15+ → 1 hour lockout
- Token blacklisting via Redis on logout
- CSP headers, CORS configuration, CSRF disabled (stateless)

### Role-Based Access Control
| Role | Capabilities |
|------|-------------|
| **Super Admin** | Invite admins, system-level management, session timeout (15 min idle / 8 hr absolute) |
| **Admin** | Full CRUD on users, movies, shows, admins, content managers. Dashboard with analytics |
| **Content Manager** | Manage assigned movies/shows based on specialization. Analytics view |
| **Support** | Read-only access (placeholder for future expansion) |
| **User** | Browse, search, filter, watchlist, subscriptions, profile management |

### Content Management
- Movie and show CRUD with poster upload, genre tags, age ratings, categories
- TMDB integration: search, trending, top-rated, now-playing, upcoming, discover, cast, similar, genres, trailer caching
- Content manager assignment with specialization checks
- Local data controller for offline/dev mode

### Subscription & Payments
- 3 subscription plans (Monthly / 6-Month / Yearly)
- Email verification before payment
- Payment processing with transaction tracking
- **Automated subscription expiry system**: daily cron jobs detect expired subscriptions, deactivate them, and send email + in-app notification warnings 3 days before expiry

### User Features
- Watchlist: add/remove/check with paginated views
- **Recently Viewed**: automatic tracking of viewed content, displayed on home page
- **Share**: share movie/show links via WhatsApp, Twitter, Facebook, or copy link
- Notifications: in-app notification system with read/unread states
- Profile management with avatar upload (ImgBB)
- Password strength validation

### Admin Dashboard
- User registration stats with charts (Recharts)
- Content stats and platform metrics
- Quick actions for common operations
- System status monitoring

### Super Admin Panel
- Invite new admins via email with multi-step form
- Admin list with search, status toggle, CSV export, resend invite
- System health check and overview

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 21, Spring Boot 3.4.5, Spring Security, JPA/Hibernate |
| **Database** | PostgreSQL 17, 30 Flyway migrations |
| **Cache** | Redis 7.4 (JWT blacklisting, refresh tokens, invite tokens, trailer cache) |
| **Email** | Dual provider: SMTP (dev) + Brevo/SendinBlue API (prod), Thymeleaf templates |
| **API Docs** | OpenAPI 3.0, Swagger UI at `/swagger-ui.html` |
| **Frontend** | React 19, Redux Toolkit, Tailwind CSS, Material UI, Axios, Formik, Recharts |
| **Super Admin** | React 18, Vite, Tailwind CSS |
| **DevOps** | Docker, Docker Compose, GitHub Actions CI/CD, EC2 deployment |
| **Testing** | JUnit 5, Mockito, TestContainers, Spring Boot Test (136 tests) |

---

## Project Structure

```
moviesAppComplete/
├── backend/                          # Spring Boot API
│   ├── src/main/java/.../
│   │   ├── Controller/               # 22 REST controllers
│   │   ├── Service/                  # 27 services (business logic)
│   │   ├── Repo/                     # 15 JPA repositories
│   │   ├── Entity/                   # 20 entities
│   │   ├── Record/                   # 22 request/response DTOs
│   │   ├── Dto/                      # DTO mappers (Function<Entity, DTO>)
│   │   ├── Auth/                     # Authentication service + sealed responses
│   │   ├── Security/                 # JWT filter, security config, RBAC
│   │   ├── Config/                   # Seeders, role hierarchy, Swagger, scheduling
│   │   ├── Utils/                    # Email service (SMTP + Brevo), OTP service
│   │   └── Exception/                # 23 custom exceptions + global handler
│   ├── src/main/resources/
│   │   ├── db/migration/             # 30 Flyway SQL migrations (V1-V30)
│   │   ├── templates/                # 6 Thymeleaf email templates
│   │   └── application*.yaml         # Dev/prod profiles
│   └── src/test/                     # 136 unit tests + 3 integration tests
├── frontend/                         # User & Admin React app
│   └── src/
│       ├── Pages/User/               # 15 pages
│       ├── Pages/Admin/              # 20 pages
│       ├── Pages/Payment/            # 2 pages
│       ├── Components/               # 16 shared components
│       ├── Components/Admin/         # 12 admin components
│       ├── Network/                  # API call functions
│       ├── services/                 # Admin API service
│       ├── redux/                    # Redux slices (user, products, payment, notifications)
│       ├── Context/                  # Environment context
│       └── Utils/                    # Helpers, validation, logout
├── super-admin/                      # Super Admin Vite app
│   └── src/
│       ├── pages/                    # Login, Dashboard, InviteAdmin, AdminsList
│       ├── components/               # Layout, ProtectedRoute, SessionWarning
│       └── services/                 # API service
├── docker-compose.yaml               # PostgreSQL + Redis + Mailpit + Backend
├── .github/workflows/deploy.yml      # CI/CD pipeline
└── dev-start.sh                      # Local dev orchestrator
```

---

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.6+

### Quick Start

```bash
# Clone
git clone https://github.com/nd199/moviesAppComplete.git
cd moviesAppComplete

# Start infrastructure (PostgreSQL, Redis, Mailpit)
docker-compose up -d db redis mailpit

# Start backend (port 8080)
cd backend
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

# Start frontend (port 3000)
cd frontend
npm install && npm start

# Start super admin (port 3001)
cd super-admin
npm install && npm run dev
```

Or use the all-in-one script:
```bash
./dev-start.sh
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@movies.com` | `ChangeMe123!` |
| Demo User | `demo@moviesapp.com` | `Demo1234567` |

### Access Points

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | User & Admin interface |
| `http://localhost:3001` | Super Admin interface |
| `http://localhost:8080/swagger-ui.html` | API documentation |
| `http://localhost:8025` | Mailpit email testing UI |

---

## API Endpoints

<details>
<summary><strong>Auth (6 endpoints)</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/customers` | Register |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh-token` | Refresh token |
| POST | `/api/v1/auth/logout` | Logout |
| POST | `/api/v1/auth/change-password` | Change password |
| POST | `/api/v1/auth/set-password` | Set password from invite |

</details>

<details>
<summary><strong>Movies & Shows (18 endpoints)</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/api/v1/movies/**` | Full CRUD + search + categories |
| GET/POST/PUT/DELETE | `/api/v1/shows/**` | Full CRUD + search + categories |

</details>

<details>
<summary><strong>TMDB Integration (14 endpoints)</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tmdb/search/movies` | Search movies |
| GET | `/api/v1/tmdb/search/shows` | Search shows |
| GET | `/api/v1/tmdb/trending/movies` | Trending movies |
| GET | `/api/v1/tmdb/trending/shows` | Trending shows |
| GET | `/api/v1/tmdb/top-rated/movies` | Top rated |
| GET | `/api/v1/tmdb/now-playing/movies` | Now playing |
| GET | `/api/v1/tmdb/upcoming/movies` | Upcoming |
| GET | `/api/v1/tmdb/movie/{tmdbId}` | Movie details |
| GET | `/api/v1/tmdb/tv/{tmdbId}` | TV show details |
| GET | `/api/v1/tmdb/movie/{tmdbId}/videos` | Trailers |
| GET | `/api/v1/tmdb/movie/{tmdbId}/cast` | Cast |
| GET | `/api/v1/tmdb/movie/{tmdbId}/similar` | Similar |
| GET | `/api/v1/tmdb/genres/movies` | Genres |
| POST | `/api/v1/tmdb/sync/movie/{tmdbId}` | Sync from TMDB |

</details>

<details>
<summary><strong>Watchlist, Notifications, View History, Subscriptions</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/GET/DELETE | `/api/v1/watchlist/**` | Add/get/remove/check watchlist |
| GET/PUT/DELETE | `/api/v1/notifications/**` | Notifications + unread count |
| POST/GET/DELETE | `/api/v1/view-history/**` | Record/get/clear view history |
| POST | `/api/v1/subscription/intent/` | Create payment intent |
| POST | `/api/v1/payments/submitPayment` | Process payment |
| POST | `/api/v1/payments/subscribe-success` | Mark subscribed |

</details>

<details>
<summary><strong>Admin, Super Admin, Health</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT | `/api/v1/admins/**` | Admin CRUD + toggle status |
| GET | `/api/v1/admin/stats/users` | User registration stats |
| GET | `/api/v1/admin/stats/content` | Content stats |
| POST | `/api/v1/system/superadmin/invite` | Invite admin |
| POST | `/api/v1/system/superadmin/resend-invite` | Resend invite |
| GET | `/api/v1/ping` | Health check |
| GET | `/api/v1/health` | Detailed health |

</details>

---

## Testing

```bash
# Run all 136 unit tests
mvn test

# Run integration tests (requires Docker)
mvn verify

# Run specific test
mvn test -Dtest=CustomerServiceImplTest
```

| Test Type | Count | Tools |
|-----------|-------|-------|
| Unit Tests | 136 | JUnit 5, Mockito |
| Integration Tests | 3 | TestContainers + PostgreSQL |
| Test Data Factory | 1 | DataFaker |

---

## CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):

1. **Build** — JDK 21, `mvn clean verify`
2. **Docker** — Build image, push to Docker Hub (SHA-tagged + latest)
3. **Deploy** — SSH into EC2, pull image, recreate containers

Triggered on push to `main` when `backend/` or `docker-compose.yaml` changes.

---

## Database

**30 Flyway migrations** covering:

| Migration | Purpose |
|-----------|---------|
| V1-V8 | Core tables (Customer, Movie, Show, Role) |
| V9-V12 | Subscription & Payment tables |
| V13-V16 | Password reset, refresh tokens, schema updates |
| V17-V21 | Admin table, triggers, sequences |
| V22-V24 | Categories, TMDB IDs, Content Manager table |
| V25-V26 | Multi-user refresh tokens, schema cleanup |
| V27-V28 | Watchlist table, token reuse detection |
| V29 | Notification table |
| V30 | View history table (recently viewed tracking) |

---

## Email Templates

6 production-quality Thymeleaf templates with MSO/Outlook compatibility:

| Template | Trigger |
|----------|---------|
| OTP verification | Registration, email verify |
| Password reset | Forgot password |
| Admin invite | Super admin invites admin |
| Content Manager invite | Super admin invites CM |
| Subscription expiry warning | 3 days before expiry (automated) |
| Subscription expired | On expiry deactivation (automated) |

---

## License

Private — All rights reserved.

---

**Built by Narendran** | [naren06251999@gmail.com](mailto:naren06251999@gmail.com)
