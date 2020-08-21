build_image:
	-docker rmi img.dev_test:latest --force
	docker build -f docker/Dockerfile . -t img.dev_test

create_network:
	-docker network rm net.dev_test
	docker network create --driver=bridge --subnet=5.5.3.0/8 net.dev_test

run_app.db:
	docker run --name redis.dev_test \
		--ip 5.5.3.2 \
		--network net.dev_test \
		-p 6379:6379 \
		-d redis:latest
		
run_app.service:
	docker run --name app.dev_test \
		--ip 5.5.3.3 \
		--network net.dev_test \
		-v ${PWD}:/app/ \
		-v ./node_modules \
		-p 7000-7010:7000-7010 \
    -e PORT=7002 \
		-e REDIS_HOST=5.5.3.2 \
		-e REDIS_PORT=6379 \
		img.dev_test

stop_dev:
	-docker stop app.dev_test
	-docker stop redis.dev_test

init:
	npm install
	make build_image
	make create_network
	
prune:
	make stop_dev --ignore-errors
	-docker container rm app.dev_test
	-docker container rm redis.dev_test
	-docker container prune