#!/bin/bash
set -e

echo "========================================="
echo "  MoviesApp Local Dev Environment"
echo "========================================="

# Load env vars
export $(grep -v '^#' .env | grep -v '^\s*$' | xargs)

# Step 1: Start DB and Redis
echo ""
echo "[1/4] Starting PostgreSQL and Redis..."
docker-compose up -d db redis
sleep 5

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
for i in $(seq 1 30); do
    docker exec postgres-mv pg_isready -U postgres > /dev/null 2>&1 && echo "PostgreSQL ready" && break
    sleep 1
done

# Step 2: Build and start backend
echo ""
echo "[2/4] Building backend..."
cd backend
mvn clean package -DskipTests -q
cd ..

echo "[3/4] Starting backend on port 8080..."
java -jar backend/target/movies-api-0.0.1-SNAPSHOT.jar &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend..."
for i in $(seq 1 30); do
    curl -s http://localhost:8080/api/v1/ping > /dev/null 2>&1 && echo "Backend ready" && break
    sleep 2
done

# Step 3: Start frontend dev servers
echo ""
echo "[4/4] Starting frontend dev servers..."
cd frontend && npm start &
FRONTEND_PID=$!
echo "Frontend (admin) starting on port 3000..."

cd ../super-admin && VITE_API_URL=http://localhost:8080 npm run dev &
SUPERADMIN_PID=$!
echo "Super-admin starting on port 5173..."

echo ""
echo "========================================="
echo "  All services started!"
echo "========================================="
echo ""
echo "  Backend:      http://localhost:8080"
echo "  Admin Panel:  http://localhost:3000"
echo "  Super Admin:  http://localhost:5173"
echo "  PostgreSQL:   localhost:5342"
echo "  Redis:        localhost:6379"
echo ""
echo "  Super Admin Login:"
echo "    Email:    superadmin@movies.com"
echo "    Password: ChangeMe123!"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "========================================="

# Trap to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID $SUPERADMIN_PID 2>/dev/null || true
    docker-compose stop db redis
    echo "Done."
}
trap cleanup EXIT INT TERM

# Wait for any process to exit
wait
