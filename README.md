# Movies OTT Platform

![Java](https://img.shields.io/badge/Java-21-b07219)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-6DB33F)
![React](https://img.shields.io/badge/React-19-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1)
![Redis](https://img.shields.io/badge/Redis-7.4-DC382D)
![License](https://img.shields.io/badge/license-private-lightgrey)
![Version](https://img.shields.io/badge/version-2.1.0-blue)

A full-stack OTT streaming platform with **30 Flyway migrations**, **150+ REST endpoints**, **5 user roles**, and **3 separate frontend applications** — built with Spring Boot 3.4, React 19, PostgreSQL, and Redis.

| | |
|---|---|
| **Live Backend API** | `https://nmoviesapi.duckdns.org` |
| **User & Admin Frontend** | `https://movies-app-complete.vercel.app` |
| **Super Admin Frontend** | Separate Vite app, deployed on Vercel |
| **Version** | 2.1.0 (July 2026) — see [Changelog](#changelog) |
| **Maintainer** | Narendran ([naren06251999@gmail.com](mailto:naren06251999@gmail.com)) |

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Database](#database)
- [Email Templates](#email-templates)
- [Changelog](#changelog)
- [License](#license)

---

## Features

### Authentication & Security
- JWT access + refresh token rotation with device fingerprinting
- Email verification via OTP (6-digit code)
- Password reset flow with time-limited tokens
- Rate limiting: 5 failed attempts → 15 min lockout, 15+ → 1 hour lockout
- Token blacklisting via Redis on logout
- CSP headers, CORS configuration, CSRF disabled (stateless API)

### Role-Based Access Control

| Role | Permissions | Notes |
|------|-------------|-------|
| **Super Admin** | All 7 permissions | Invite admins, system-level config, session timeout (15 min idle / 8 hr absolute) |
| **Admin** | `MOVIE_READ/WRITE/DELETE`, `USER_READ`, `USER_MANAGE`, `VIEW_REPORTS` | Full CRUD on users, movies, shows, admins, content managers; analytics dashboard |
| **Content Manager** | `MOVIE_READ/WRITE/DELETE` | Manage assigned movies/shows based on specialization |
| **Support** | `MOVIE_READ`, `USER_READ`, `VIEW_REPORTS` | Read access to catalog, users, and reports — no write access |
| **User** | `MOVIE_READ` | Browse, search, filter, watchlist, subscriptions, profile management |

> Role hierarchy: `canAssign(current, target)` requires `currentLevel > targetLevel`; `canModify(current, target)` requires `currentLevel >= targetLevel`.

### Content Management
- Movie and show CRUD with poster upload, genre tags, age ratings, categories
- TMDB integration: search, trending, top-rated, now-playing, upcoming, discover, cast, similar, genres, trailer caching
- Content manager assignment with specialization checks
- Local data controller for offline/dev mode

### Subscription & Payments
- 3 subscription plans (Monthly / 6-Month / Yearly)
- Email verification before payment
- Payment processing with transaction tracking
- **Automated subscription expiry system**: daily cron jobs detect expired subscriptions, deactivate them, and send an expiry email + in-app notification; a separate job warns subscriptions expiring within 3 days

### User Features
- Watchlist: add/remove/check with paginated views
- **Recently Viewed**: automatic tracking of viewed content, displayed on the home page
- **Share**: share movie/show links via WhatsApp, Twitter, Facebook, or copy link
- Notifications: in-app system with read/unread states, mark-all-read
- Profile management with avatar upload (ImgBB)
- Password strength validation

### Admin Dashboard
- User registration stats with charts (Recharts)
- Content stats and platform metrics
- Quick actions for common operations
- System status monitoring

### Super Admin Panel
- Invite new admins via email with a multi-step form
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

> **Note:** Redux slice files in `frontend/src/redux/` currently mix naming conventions (`userSlice.js`, `ProductsRedux.js`, `PaymentRedux.js`, `notificationRedux.js`). Standardizing on a single `*Slice.js` convention is a planned cleanup — see [Changelog](#changelog).

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

> These are seeded development credentials only. **Rotate or disable them before any production or public-facing deployment.**

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

## Environment Variables

Key variables the backend expects (see `application*.yaml` for the full list and defaults per profile):

| Variable | Purpose | Required In |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | Selects `dev` or `prod` config | All environments |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection | All environments |
| `REDIS_HOST`, `REDIS_PORT` | Redis connection | All environments |
| `JWT_SECRET` | Signing key for access/refresh tokens | All environments |
| `TMDB_API_KEY` | TMDB catalog integration | All environments |
| `BREVO_API_KEY` | Transactional email in production | `prod` only |
| `IMGBB_API_KEY` | Avatar/poster image hosting | All environments |

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
<summary><strong>Admin, Super Admin, Health (8 endpoints)</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT | `/api/v1/admins/**` | Admin CRUD + toggle status |
| GET | `/api/v1/admin/stats/users` | User registration stats |
| GET | `/api/v1/admin/stats/content` | Content stats |
| POST | `/api/v1/system/superadmin/invite` | Invite admin |
| POST | `/api/v1/system/superadmin/resend-invite` | Resend invite |
| GET | `/api/v1/ping` | Simple health check |
| GET | `/api/v1/health` | Detailed health with DB status |

</details>

---

## Testing

```bash
# Run all 136 unit tests
mvn test

# Run integration tests (requires Docker)
mvn verify

# Run a specific test
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

1. **Build** — JDK 21, `mvn clean verify` (compile + all 136 tests)
2. **Docker** — Build image, push to Docker Hub (SHA-tagged + `latest`)
3. **Deploy** — SSH into EC2, pull image, recreate containers with `docker-compose --force-recreate`
4. **Cleanup** — `docker image prune -af` + `docker builder prune -af`

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

## Changelog

| Version | Date | Summary |
|---------|------|---------|
| **2.1.0** | Jul 2026 | Documentation cleanup: corrected Support role description to match actual RBAC permissions, added environment variables reference, added table of contents, reconciled endpoint counts across docs |
| **2.0.0** | Jun 2026 | Added View History and Notification modules (V29–V30); token family + reuse detection for refresh tokens (V28) |
| **1.5.0** | Mar 2026 | Added Watchlist feature and Content Manager role; multi-user refresh token support |
| **1.0.0** | Nov 2025 | Initial production release: core catalog, subscriptions, payments, admin panel |

---

## License

Private — All rights reserved.

---

**Built by Narendran** | [naren06251999@gmail.com](mailto:naren06251999@gmail.com)
