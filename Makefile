.PHONY: run stop restart build clean logs help

# Default target
help:
	@echo "Available commands:"
	@echo "  make run      - Build and start services in the background"
	@echo "  make stop     - Stop and remove containers"
	@echo "  make restart  - Restart all services"
	@echo "  make build    - Build or rebuild services"
	@echo "  make logs     - View real-time logs"
	@echo "  make clean    - Stop and remove containers, networks, and images"

run:
	docker-compose up -d --build

stop:
	docker-compose down

restart:
	docker-compose down
	docker-compose up -d --build

build:
	docker-compose build

logs:
	docker-compose logs -f

clean:
	docker-compose down --rmi all --volumes --remove-orphans

publish:
	git add .
	git commit -m "update"
	git push origin main
