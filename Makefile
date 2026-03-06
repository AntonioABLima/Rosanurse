# Makefile — Rosana frontend

.PHONY: dev build start clean

dev:
	@echo "Starting frontend (Next.js)"
	cd src/frontend && npm run dev

build:
	@echo "Building frontend for production"
	cd src/frontend && npm run build

start: build
	@echo "Starting frontend (production)"
	cd src/frontend && npm run start

clean:
	@echo "Cleaning generated files"
	rm -rf src/frontend/node_modules
	rm -rf src/frontend/.next
