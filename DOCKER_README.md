# 🐳 Docker Setup Guide for Healthcare Scheduler

A comprehensive guide to run the Healthcare Scheduler application using Docker. This guide is designed for open-source contributors and developers who want to quickly set up and run the project locally.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Overview](#project-overview)
- [Docker Setup Methods](#docker-setup-methods)
  - [Method 1: Docker Compose (Recommended)](#method-1-docker-compose-recommended)
  - [Method 2: Manual Docker Commands](#method-2-manual-docker-commands)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Docker**: Version 20.10 or higher
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac)
  - [Install Docker Engine](https://docs.docker.com/engine/install/) (Linux)
- **Docker Compose**: Version 2.0 or higher (included with Docker Desktop)
- **Git**: For cloning the repository

### Verify Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Verify Docker is running
docker ps
```

## ⚡ Quick Start

Get the Healthcare Scheduler running in under 5 minutes:

```bash
# 1. Clone the repository
git clone <repository-url>
cd Healthcare_Scheduler

# 2. Start the application with Docker Compose
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3003
# API: http://localhost:3003/api/providers
```

That's it! The application should now be running. Skip to [Accessing the Application](#accessing-the-application) to start using it.

## 🏥 Project Overview

The Healthcare Scheduler is a Next.js application that allows users to:

- **Book appointments** with healthcare providers
- **View available providers** and their specialties
- **Manage existing appointments** (reschedule/cancel)
- **Search appointments** by email or provider

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Data Storage**: JSON files (appointments.json, providers.json)
- **Authentication**: JWT tokens
- **Containerization**: Docker & Docker Compose

## 🚀 Docker Setup Methods

### Method 1: Docker Compose (Recommended)

Docker Compose is the easiest way to run the application with all necessary configurations.

#### Step 1: Clone and Navigate

```bash
git clone <repository-url>
cd Healthcare_Scheduler
```

#### Step 2: Start the Application

```bash
# Start in detached mode (runs in background)
docker-compose up -d

# Or start with logs visible (useful for debugging)
docker-compose up
```

#### Step 3: Verify It's Running

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f healthcare-scheduler
```

#### Docker Compose Commands

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# Rebuild and start (after code changes)
docker-compose up --build -d

# View logs
docker-compose logs -f

# Execute commands inside the container
docker-compose exec healthcare-scheduler sh
```

### Method 2: Manual Docker Commands

For more control over the Docker setup:

#### Step 1: Build the Image

```bash
# Build the Docker image
docker build -t healthcare-scheduler .

# View the built image
docker images | grep healthcare-scheduler
```

#### Step 2: Run the Container

```bash
# Run with basic configuration
docker run -d \
  --name healthcare-scheduler-container \
  -p 3003:3000 \
  --env JWT_SECRET=healthcare-scheduler-jwt-secret-key-2024 \
  healthcare-scheduler

# Run with custom environment variables
docker run -d \
  --name healthcare-scheduler-container \
  -p 3003:3000 \
  --env JWT_SECRET=your-custom-secret \
  --env NODE_ENV=production \
  healthcare-scheduler
```

#### Step 3: Manage the Container

```bash
# View running containers
docker ps

# View container logs
docker logs -f healthcare-scheduler-container

# Stop the container
docker stop healthcare-scheduler-container

# Remove the container
docker rm healthcare-scheduler-container

# Execute commands inside the container
docker exec -it healthcare-scheduler-container sh
```

## 🌐 Accessing the Application

Once the container is running, you can access:

### Frontend Application
- **URL**: http://localhost:3003
- **Features**: Book appointments, manage bookings, view providers

### API Endpoints
- **Providers**: http://localhost:3003/api/providers
- **Appointments**: http://localhost:3003/api/appointments

### Sample API Calls

```bash
# Get all providers
curl http://localhost:3003/api/providers

# Get all appointments
curl http://localhost:3003/api/appointments

# Get appointments by email
curl "http://localhost:3003/api/appointments?userEmail=user@example.com"

# Create a new appointment (POST)
curl -X POST http://localhost:3003/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": "1",
    "dateTime": "2024-12-01T14:00",
    "userEmail": "user@example.com"
  }'
```

## 🔐 Environment Variables

The application uses the following environment variables:

### Required Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `JWT_SECRET` | Secret key for JWT token generation | `healthcare-scheduler-jwt-secret-key-2024` |
| `NODE_ENV` | Node.js environment | `production` |

### Optional Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `PORT` | Internal container port | `3000` |
| `HOSTNAME` | Container hostname | `0.0.0.0` |

### Setting Custom Environment Variables

#### Docker Compose Method

Edit `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - JWT_SECRET=your-super-secret-key-change-in-production
  - CUSTOM_VAR=your-value
```

#### Docker Run Method

```bash
docker run -d \
  --name healthcare-scheduler-container \
  -p 3003:3000 \
  --env JWT_SECRET=your-secret-key \
  --env NODE_ENV=production \
  --env CUSTOM_VAR=your-value \
  healthcare-scheduler
```

#### Environment File Method

Create a `.env` file:

```bash
# .env
JWT_SECRET=your-super-secret-key
NODE_ENV=production
CUSTOM_VAR=your-value
```

Then use it with Docker Compose:

```yaml
# docker-compose.yml
services:
  healthcare-scheduler:
    env_file:
      - .env
```

## 📡 API Endpoints

The application provides the following REST API endpoints:

### Providers Endpoint

```http
GET /api/providers
```

**Response**: Array of healthcare providers

```json
[
  {
    "id": "1",
    "facilityName": "CityHealth Medical Center",
    "doctorName": "Dr. Jane Smith",
    "specialty": "TB Test",
    "availableHours": ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]
  }
]
```

### Appointments Endpoints

#### Get Appointments

```http
GET /api/appointments
GET /api/appointments?userEmail=user@example.com
GET /api/appointments?providerId=1
GET /api/appointments?userEmail=user@example.com&providerId=1
```

#### Create Appointment

```http
POST /api/appointments
Content-Type: application/json

{
  "providerId": "1",
  "dateTime": "2024-12-01T14:00",
  "userEmail": "user@example.com"
}
```

#### Update Appointment

```http
PUT /api/appointments
Content-Type: application/json

{
  "reservationCode": "existing-code",
  "newDateTime": "2024-12-02T15:00"
}
```

#### Delete Appointment

```http
DELETE /api/appointments
Content-Type: application/json

{
  "reservationCode": "existing-code"
}
```

## 🔄 Development Workflow

### Making Code Changes

When developing with Docker:

1. **Make your code changes**
2. **Rebuild and restart**:
   ```bash
   docker-compose up --build -d
   ```
3. **View logs** to check for issues:
   ```bash
   docker-compose logs -f healthcare-scheduler
   ```

### Debugging

#### View Container Logs

```bash
# Docker Compose
docker-compose logs -f healthcare-scheduler

# Direct Docker
docker logs -f healthcare-scheduler-container
```

#### Execute Commands Inside Container

```bash
# Docker Compose
docker-compose exec healthcare-scheduler sh

# Direct Docker
docker exec -it healthcare-scheduler-container sh
```

#### Check Container Status

```bash
# Docker Compose
docker-compose ps

# Direct Docker
docker ps
```

### Data Persistence

The application uses JSON files for data storage:

- **Providers**: `src/data/providers.json`
- **Appointments**: `src/data/appointments.json`

To persist data changes, you can mount these files as volumes:

```yaml
# docker-compose.yml
volumes:
  - ./src/data:/app/src/data
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Port Already in Use

**Error**: `Port 3003 is already allocated`

**Solution**:
```bash
# Find what's using the port
lsof -i :3003

# Kill the process or use a different port
docker-compose down
# Edit docker-compose.yml to use different port (e.g., 3004:3000)
docker-compose up -d
```

#### Container Won't Start

**Error**: Container exits immediately

**Solution**:
```bash
# Check logs for errors
docker-compose logs healthcare-scheduler

# Common fixes:
# 1. Rebuild the image
docker-compose up --build -d

# 2. Remove old containers
docker-compose down
docker system prune -f
docker-compose up -d
```

#### Build Failures

**Error**: Docker build fails

**Solution**:
```bash
# Clean Docker cache
docker builder prune -f

# Rebuild without cache
docker build --no-cache -t healthcare-scheduler .

# Or with Docker Compose
docker-compose build --no-cache
```

#### API Not Working

**Error**: API endpoints return 404 or 500

**Solution**:
```bash
# Check if container is running
docker-compose ps

# Check application logs
docker-compose logs -f healthcare-scheduler

# Verify environment variables
docker-compose exec healthcare-scheduler env | grep JWT_SECRET
```

### Getting Help

If you encounter issues:

1. **Check the logs** first: `docker-compose logs -f`
2. **Verify your environment**: Docker version, available ports
3. **Clean and rebuild**: `docker-compose down && docker-compose up --build -d`
4. **Check the GitHub issues** for similar problems
5. **Create a new issue** with:
   - Your operating system
   - Docker version
   - Complete error messages
   - Steps to reproduce

## 🚀 Production Deployment

### Cloud Platforms

#### AWS ECS/Fargate

```bash
# Build and tag for AWS ECR
docker build -t healthcare-scheduler .
docker tag healthcare-scheduler:latest <aws-account>.dkr.ecr.<region>.amazonaws.com/healthcare-scheduler:latest
docker push <aws-account>.dkr.ecr.<region>.amazonaws.com/healthcare-scheduler:latest
```

#### Google Cloud Run

```bash
# Build and push to Google Container Registry
docker build -t healthcare-scheduler .
docker tag healthcare-scheduler gcr.io/<project-id>/healthcare-scheduler
docker push gcr.io/<project-id>/healthcare-scheduler
```

#### Heroku Container Registry

```bash
# Login and push to Heroku
heroku container:login
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

### Self-Hosted Deployment

#### Docker Swarm

```yaml
# docker-stack.yml
version: '3.8'
services:
  healthcare-scheduler:
    image: healthcare-scheduler:latest
    ports:
      - "80:3000"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
```

```bash
# Deploy to swarm
docker stack deploy -c docker-stack.yml healthcare-scheduler
```

#### Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: healthcare-scheduler
spec:
  replicas: 3
  selector:
    matchLabels:
      app: healthcare-scheduler
  template:
    metadata:
      labels:
        app: healthcare-scheduler
    spec:
      containers:
      - name: healthcare-scheduler
        image: healthcare-scheduler:latest
        ports:
        - containerPort: 3000
        env:
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
```

### Security Considerations for Production

1. **Change JWT Secret**: Use a strong, unique JWT secret
2. **Use HTTPS**: Set up SSL/TLS certificates
3. **Environment Variables**: Store secrets securely
4. **Container Security**: Run as non-root user (already configured)
5. **Network Security**: Use private networks when possible

## 📚 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose Documentation**: https://docs.docker.com/compose/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn UI**: https://ui.shadcn.com/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker: `docker-compose up --build -d`
5. Submit a pull request

## 📄 License

This project is open source. Please check the LICENSE file for details.

---

**Happy coding! 🚀**

If you encounter any issues with this Docker setup, please create an issue on GitHub with detailed information about your environment and the problem you're experiencing. 