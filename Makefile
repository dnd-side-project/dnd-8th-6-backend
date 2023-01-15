shell:
	docker-compose run --service-ports app bash

build: clean
	docker-compose build

up:
	docker-compose up

down:
	docker-compose down --remove-orphans