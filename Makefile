install:
	npm run install:all
	python -m pip install -r ml-engine/requirements.txt

dev:
	npm run dev

client:
	npm run client

server:
	npm run server

ml:
	npm run ml

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

test:
	npm run test:server
	npm run test:client
	npm run test:ml

test-client:
	npm run test:client

test-server:
	npm run test:server

test-ml:
	npm run test:ml

lint:
	npm run lint

build:
	npm run build

clean:
	npm run clean
