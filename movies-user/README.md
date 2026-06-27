# Movies Frontend

A modern React-based movie streaming application frontend with user authentication, admin panel, and payment integration.

## 🚀 Features

- **User Authentication**: Secure login/logout with JWT tokens and httpOnly cookies
- **Role-Based Access**: User and Admin role management
- **Movie Streaming**: Video player with full-screen support
- **Admin Panel**: Complete CRUD operations for users and movies
- **Payment Integration**: Secure payment checkout with success handling
- **Responsive Design**: Mobile-first approach with Material-UI
- **State Management**: Redux Toolkit with persistent storage

## 🛠️ Tech Stack

### Core
- **React 19.2.4** - Modern React with hooks
- **Redux Toolkit 2.11.2** - State management
- **React Router 7.13.0** - Client-side routing
- **Material-UI 7.3.8** - UI component library

### Security & Authentication
- **react-cookie 8.0.1** - Cookie management with security options
- **axios 1.13.5** - HTTP client with interceptors
- **JWT tokens** - Secure authentication with httpOnly cookies

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Bundle Analyzer** - Build optimization analysis

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd movies-frontend

# Install dependencies
npm install

# Copy environment file
cp .env .env

# Start development server
npm start
```

## 🔧 Environment Variables

### Local Development
Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:8080
NODE_ENV=development
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_COOKIE_SECURE=false
REACT_APP_COOKIE_SAME_SITE=lax
```

### Vercel Deployment
Set the following environment variable in your Vercel project settings:
- `REACT_APP_API_URL` - Your production backend API URL (e.g., `https://your-backend-domain.com`)

The `vercel.json` configuration automatically maps this variable during the build process.

## 📜 Available Scripts

```bash
# Development
npm start              # Start development server
npm run dev            # Start without auto-opening browser

# Building
npm run build          # Production build
npm run build:prod     # Production build with optimizations

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format code with Prettier

# Analysis & Security
npm run analyze        # Analyze bundle size
npm run security-check  # Check for vulnerabilities
npm audit              # Detailed security audit

# Testing
npm test               # Run tests
npm run test:coverage   # Run with coverage

# Maintenance
npm run clean          # Clean build artifacts
npm run pre-commit      # Run pre-commit checks
```

## 🔒 Security Features

### Cookie Management
- **Secure Cookies**: HttpOnly and Secure flags in production
- **SameSite Protection**: CSRF protection with lax/strict settings
- **Token Storage**: JWT tokens stored securely with expiration
- **Automatic Cleanup**: Secure logout with cookie clearing

### API Security
- **Request Interceptors**: Automatic token injection
- **Response Interceptors**: Handle 401 unauthorized responses
- **Timeout Protection**: 10-second request timeout
- **Security Headers**: X-Requested-With for CSRF protection

### Content Security
- **CSP Ready**: Content Security Policy configuration
- **XSS Protection**: Built-in XSS mitigation
- **Input Validation**: Formik with Yup validation

## 🏗️ Project Structure

```
src/
├── Components/          # Reusable UI components
│   ├── NavBar.js       # Navigation with auth
│   └── ...             # Other components
├── Pages/              # Route components
│   ├── User/           # User-facing pages
│   ├── Admin/          # Admin panel pages
│   └── Payment/        # Payment flow pages
├── Redux/              # State management
│   ├── userSlice.js     # User state
│   └── ...             # Other slices
├── Utils/               # Utility functions
├── Network/             # API calls
└── Assets/             # Static assets
```

## 🚀 Deployment

### Production Build
```bash
# Create optimized build
npm run build:prod

# Analyze bundle size
npm run analyze
```

### Environment Setup
- Set `NODE_ENV=production` for production builds
- Configure `REACT_APP_API_URL` to point to production API
- Enable secure cookies in production environment

## 🔧 Development

### Code Style
- Uses Prettier for consistent formatting
- ESLint for code quality
- Pre-commit hooks for quality control

### Best Practices
- Component-based architecture
- Custom hooks for reusable logic
- Error boundaries for error handling
- Lazy loading for performance

## 🐛 Troubleshooting

### Common Issues

1. **Cookie Issues**
   - Check `REACT_APP_COOKIE_SECURE` setting
   - Verify domain and path configuration
   - Clear browser cookies and retry

2. **API Connection**
   - Verify `REACT_APP_API_URL` is correct
   - Check backend is running
   - Ensure CORS is configured on backend

3. **Build Issues**
   - Run `npm run clean` before building
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Security Checklist
- [ ] Environment variables are set correctly
- [ ] HTTPS is used in production
- [ ] Cookies have secure flags
- [ ] CSP headers are configured
- [ ] Dependencies are regularly updated

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
