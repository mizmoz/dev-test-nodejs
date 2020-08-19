# hack npm install not firing
npm install

docker run --name service.countries \
		-v ${PWD}:/app/ \
		-v ./node_modules \
		-p 7000-7010:7000-7010 \
    -e PORT=7002 \
		-d img.service_country