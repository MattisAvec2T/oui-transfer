# Create .env
env:
	echo 'DB_PASSWORD="password"' > .env
	echo 'DB_USER="root"' >> .env
	echo 'DB_NAME="ouiTransfer"' >> .env
	echo 'DB_HOST="database"' >> .env
	echo 'JWT_SECRET="secret-key"' >> .env
	echo 'JWT_EXPIRES=500000000' >> .env
	@echo "// .env file created //"

# To enter container cli
db-bash:
	docker exec -ti oui-transfer-database-1 bash
server-bash:
	docker exec -ti oui-transfer-server-1 bash
frontend-bash:
	docker exec -ti oui-transfer-frontend-1 bash

# Docker commands
build:
	docker compose build --no-cache
	@echo "// Docker images built successfully //"
up:
	docker compose up -d
	@echo "// Applications running //"
	@echo "// Client : http://localhost:5173 //"
	@echo "// Server : http://localhost:3000 //"
down:
	docker compose down
	@echo "// Applications stopped //"
restart:
	docker down up
	@echo "// Applications restarted //"
	@echo "// Client : http://localhost:5173 //"
	@echo "// Server : http://localhost:3000 //"
clean:
	docker rmi -f oui-transfer-frontend || true
	docker rmi -f oui-transfer-server || true
	@echo "// Client and server images removed //"
	@echo "// The volumes are still there ! //"
package:
	@echo "// Installing node_modules for server... //"
	docker run --rm -v $(PWD)/server:/app -w /app node:22 npm install
	@echo "// Installing node_modules for service... //"
	docker run --rm -v $(PWD)/frontend:/app -w /app node:22-alpine npm install
	@echo "// node_modules installed successfully //"