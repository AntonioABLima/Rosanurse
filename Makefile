# Makefile — Rosana frontend

.PHONY: dev build start install clean

install:
	@echo "Installing dependencies"
	cd src/frontend && npm install

dev:
	@echo "Starting frontend (Next.js)"
	cd src/frontend && npm run dev

build: install
	@echo "Building frontend for production"
	cd src/frontend && npm run build

start:
	@if [ ! -d src/frontend/out ]; then $(MAKE) build; fi
	@echo "Starting frontend (production)"
	cd src/frontend && npm run start

clean:
	@echo "Cleaning generated files"
	rm -rf src/frontend/node_modules
	rm -rf src/frontend/.next
