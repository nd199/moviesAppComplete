# 🔐 Secure Admin Setup Guide

## 🚨 SECURITY NOTICE
- ❌ **NEVER** expose admin registration publicly in production
- ✅ **ALWAYS** use environment variables for admin credentials
- 🔒 **NEVER** commit admin credentials to version control

## 📋 Setup Steps

### 1. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Copy the example file
cp .env.example .env

# Edit with your secure credentials
nano .env
```

**Required Environment Variables:**
```bash
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=SecureAdminPass123!
DEFAULT_ADMIN_NAME=System Administrator
```

### 2. Start Backend with Data Initialization

```bash
# Start Spring Boot with data initialization enabled
./mvnw spring-boot:run -Dspring-boot.run.arguments="--app.data-initialization.enabled=true"
```

### 3. Verify Admin Creation

You should see console output:
```
✅ Default admin user created: admin@yourcompany.com
🔐 Login with: admin@yourcompany.com / [your password]
```

### 4. Login to Admin Panel

- **Frontend URL**: `http://localhost:3000/admin/login`
- **Use credentials**: Your environment variables
- **Access**: Full admin dashboard and management tools

## 🛡️ Security Features Implemented

### ✅ What's Secure:
1. **No public admin registration** - Removed `/registerAdmin` route
2. **Environment-based creation** - Admin created via env vars only
3. **One-time creation** - Admin created only if doesn't exist
4. **Role-based protection** - All admin endpoints require `ROLE_ADMIN`
5. **Password encryption** - BCrypt hashing for all passwords

### 🔧 Backend Security:
```java
// Admin endpoints protected
@PreAuthorize("hasRole('ADMIN')")

// Role-based route protection
.requestMatchers("/api/v1/customers/**", "/api/v1/roles/**").hasRole("ADMIN")
```

### 🎯 Frontend Security:
```javascript
// Protected routes
<ProtectedRoute requiredRole="admin">
  <AdminComponent />
</ProtectedRoute>
```

## 🚀 Production Deployment

### Environment Variables (Production):
```bash
# Use strong, unique passwords
DEFAULT_ADMIN_EMAIL=admin@yourproductiondomain.com
DEFAULT_ADMIN_PASSWORD=SuperSecurePassword123!@#

# Disable data initialization after first run
app.data-initialization.enabled=false
```

### Database Verification:
```sql
-- Verify admin was created
SELECT c.email, c.name, r.name as role 
FROM customer c 
JOIN customer_roles cr ON c.id = cr.customer_id 
JOIN role r ON cr.role_id = r.id 
WHERE r.name = 'ROLE_ADMIN';
```

## 🔄 Creating Additional Admins

### Option 1: Database Update (Recommended)
```sql
-- Promote existing user to admin
INSERT INTO customer_roles (customer_id, role_id)
SELECT c.id, r.id
FROM customer c, role r
WHERE c.email = 'user@yourcompany.com' 
AND r.name = 'ROLE_ADMIN';
```

### Option 2: Admin-Only Endpoint
```bash
# Only existing admins can create new admins
POST /api/v1/customers/{id}/promote-to-admin
Authorization: Bearer <admin-jwt-token>
```

## 🚫 What We Removed (Insecure)

❌ **Removed public admin registration:**
```javascript
// REMOVED - Insecure!
<Route path="/registerAdmin" element={<AdminRegister />} />
```

❌ **Removed public admin creation API:**
```java
// REMOVED - Insecure!
@PostMapping("/auth/admins") // Anyone could create admin
```

## 📊 Admin Capabilities

Once logged in as admin, you can:

### 👥 User Management:
- View all users (except admins)
- Edit user profiles
- Delete users
- Create new users
- Promote users to admin

### 🎬 Content Management:
- Add/edit/delete movies
- Add/edit/delete shows
- Manage product catalog
- View analytics

### 📈 Analytics:
- User statistics
- Subscription data
- Revenue tracking
- Content performance

## 🔍 Troubleshooting

### Admin Not Created:
```bash
# Check environment variables
echo $DEFAULT_ADMIN_EMAIL
echo $DEFAULT_ADMIN_PASSWORD

# Check database
SELECT * FROM customer WHERE email = 'admin@yourcompany.com';
```

### Login Issues:
1. Verify admin exists in database
2. Check password is correctly encoded
3. Ensure role assignment worked
4. Clear browser cookies/cache

### Access Denied:
1. Verify JWT token is valid
2. Check role assignment in database
3. Ensure frontend role check matches backend

## 🎯 Best Practices

1. **Change default password** after first login
2. **Use 2FA** for admin accounts
3. **Audit admin actions** with logging
4. **Regular security reviews** of admin access
5. **Limit admin count** to minimum necessary
6. **Use IP whitelisting** for admin access (optional)

---

## 🚨 Emergency Reset

If you lose admin access:

1. **Stop the application**
2. **Set environment variables** for new admin
3. **Enable data initialization** temporarily
4. **Start application** to create new admin
5. **Disable data initialization** for production

```bash
# Emergency admin creation
export DEFAULT_ADMIN_EMAIL=emergency@yourcompany.com
export DEFAULT_ADMIN_PASSWORD=EmergencyPass123!
export app.data-initialization.enabled=true
./mvnw spring-boot:run
```

---

**🔐 Your admin system is now production-ready and secure!**
