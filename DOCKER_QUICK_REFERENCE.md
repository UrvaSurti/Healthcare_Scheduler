# 🚀 Docker Quick Reference - Healthcare Scheduler

A quick reference for the most commonly used Docker commands for the Healthcare Scheduler project.

## ⚡ Quick Start Commands

```bash
# Clone and start the application
git clone <repository-url>
cd Healthcare_Scheduler
docker-compose up -d

# Access the application
open http://localhost:3003
```

## 🐳 Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start application in background |
| `docker-compose up` | Start with logs visible |
| `docker-compose down` | Stop and remove containers |
| `docker-compose restart` | Restart the application |
| `docker-compose up --build -d` | Rebuild and start |
| `docker-compose logs -f` | View live logs |
| `docker-compose ps` | Show running containers |
| `docker-compose exec healthcare-scheduler sh` | Access container shell |

## 🔧 Docker Commands (Manual)

### Build and Run
```bash
# Build the image
docker build -t healthcare-scheduler .

# Run the container
docker run -d --name healthcare-scheduler-container -p 3003:3000 --env JWT_SECRET=your-secret healthcare-scheduler

# Stop the container
docker stop healthcare-scheduler-container

# Remove the container
docker rm healthcare-scheduler-container
```

### Management
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View logs
docker logs -f healthcare-scheduler-container

# Execute commands in container
docker exec -it healthcare-scheduler-container sh
```

## 🌐 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3003 | Main application |
| API Providers | http://localhost:3003/api/providers | Get all providers |
| API Appointments | http://localhost:3003/api/appointments | Manage appointments |

## 🔍 Debugging Commands

```bash
# View application logs
docker-compose logs -f healthcare-scheduler

# Check container status
docker-compose ps

# Access container shell
docker-compose exec healthcare-scheduler sh

# Check environment variables
docker-compose exec healthcare-scheduler env

# Restart with rebuild
docker-compose up --build -d
```

## 🧹 Cleanup Commands

```bash
# Stop and remove everything
docker-compose down

# Remove unused containers, networks, images
docker system prune -f

# Remove all stopped containers
docker container prune -f

# Remove unused images
docker image prune -f

# Nuclear option - remove everything
docker system prune -a -f
```

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | `docker-compose down` then `docker-compose up -d` |
| Container won't start | `docker-compose logs healthcare-scheduler` |
| Build fails | `docker-compose build --no-cache` |
| API not working | Check logs: `docker-compose logs -f` |
| Out of disk space | `docker system prune -a -f` |

## 📋 Environment Variables

```bash
# Required
JWT_SECRET=healthcare-scheduler-jwt-secret-key-2024

# Optional
NODE_ENV=production
PORT=3000
```

## 🔄 Development Workflow

```bash
# 1. Make code changes
# 2. Rebuild and restart
docker-compose up --build -d

# 3. Check logs
docker-compose logs -f healthcare-scheduler

# 4. Test the application
curl http://localhost:3003/api/providers
```

## 📡 API Testing

```bash
# Get providers
curl http://localhost:3003/api/providers

# Get appointments
curl http://localhost:3003/api/appointments

# Create appointment
curl -X POST http://localhost:3003/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"providerId":"1","dateTime":"2024-12-01T14:00","userEmail":"user@example.com"}'
```

---

💡 **Pro Tip**: Keep this reference handy while developing with Docker!

For detailed documentation, see [DOCKER_README.md](./DOCKER_README.md) 