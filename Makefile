# Build the program executable (backend + frontend)
.PHONY: all
all: frontend/dist
	go build -o voxeti -tags embed

# Start the frontend dev server
.PHONY: frontend-dev
frontend-dev: frontend/node_modules
	cd frontend && pnpm dev

# Start the backend dev server
.PHONY: backend-dev
backend-dev: db-dev
	wgo -exit clear :: go run -tags dev . -db mongodb://administrator:Welcome1234@127.0.0.1:27017

# Start the dev database
.PHONY: db-dev
db-dev:
	sudo docker compose -f docker-compose.db.yml up -d

# Remove build files, installed dependencies, and test database
.PHONY: clean
clean:
	rm -f voxeti
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	sudo docker compose -f docker-compose.db.yml down

# Run health check
.PHONY: health-check
health-check:
	curl --silent 127.0.0.1:3000 > /dev/null
	curl --silent 127.0.0.1:3000/api/healthcheck > /dev/null

# Run tests
.PHONY: test
test: backend-test frontend-test

# Run static analysis checks
.PHONY: check
check: backend-check frontend-check shell-check

### Everything below is a helper target, and likely does not need to be run manually

# Run backend tests
.PHONY: backend-test
backend-test: backend-unit-test backend-e2e-test

# Run backend unit tests
.PHONY: backend-unit-test
backend-unit-test:
	go test voxeti/backend/...

# Run backend end-to-end tests
.PHONY: backend-e2e-test
backend-e2e-test:
	go test voxeti

# Run frontend tests
.PHONY: frontend-test
frontend-test: frontend-unit-test frontend-e2e-test

# Run frontend unit tests
.PHONY: frontend-unit-test
frontend-unit-test: frontend/node_modules
	cd frontend && pnpm test:unit

# Run frontend end-to-end tests
.PHONY: frontend-e2e-test
frontend-e2e-test: frontend/node_modules
	cd frontend && pnpm test:e2e

# Run backend static analysis checks
.PHONY: backend-check
backend-check: backend-lint backend-format backend-vet

# Lint backend source code
.PHONY: backend-lint
backend-lint:
	golangci-lint run

# Format backend source code
.PHONY: backend-format
backend-format:
	go fmt

# Vet backend source code
.PHONY: backend-vet
backend-vet:
	go vet

# Run frontend static analysis checks
.PHONY: frontend-check
frontend-check: frontend-lint frontend-format

# Lint frontend source code
.PHONY: frontend-lint
frontend-lint: frontend/node_modules
	cd frontend && pnpm lint

# Format frontend source code
.PHONY: frontend-format
frontend-format: frontend/node_modules
	cd frontend && pnpm prettier --write .

# Run shell script static analysis checks
.PHONY: shell-check
shell-check:
	find . -type f -name '*.sh' | xargs shellcheck

# Build the frontend
frontend/dist: frontend/node_modules frontend/src
	cd frontend && pnpm build

# Install frontend dependencies
frontend/node_modules: frontend/package.json
	cd frontend && pnpm install
