# Nodejs Developer Test

Given that you're looking for somebody to architect an application, i've taken the liberty of changing the approach a bit.

I believe in reusing other well known software rather than writing everything from the start.

So, i've started with the CRUD part of the task

json server - https://github.com/typicode/json-server - fits the bill well on the CRUD operations.

what it lacks is the redis key save part, which i've implemented in redis-server.js. I am sure this could be achieved even better by running json-server in the CLI, rather than from node, but i could not find a good middleware integration in this short time frame.

However, json-server does too many things so i believe it should be fronted by an API Gateway - https://aws.amazon.com/api-gateway/ - which i have at https://qkiqq38wre.execute-api.eu-west-1.amazonaws.com/production/

The beauty of this approach is that the auth + usage quotas + encryption + exposure of features can be done on a case by case

There's not enough time to make a cloudformation template to reflect the api gw config, but i'll try to outline the direction i was going for

So, just for demo purposes a curl -X GET https://qkiqq38wre.execute-api.eu-west-1.amazonaws.com/production/countries will output all countries, while curl -X GET https://qkiqq38wre.execute-api.eu-west-1.amazonaws.com/production/ will require credentials, as per the config i've added in api gateway.

for updates, curl -H "Content-Type: application/json" -X PATCH https://qkiqq38wre.execute-api.eu-west-1.amazonaws.com/production/countries/afg -d '{"population":1000}' should do the job

Behind the scenes there's an EC2 instance i've set up to run with the code in this repo, by using docker compose. API GW is running as a proxy, but elegantly adds HTTPS to my basic app

This approach also fits very well the last part - docker - by enabling the service to run with multiple workers, if the data file is on a shared volume.

I would replace though the docker redis with AWS' fully managed service. Also, i'd replace the IAM authentication i have for GET /, with Cognito, to enable an elegant SSO experience

This way, i believe the architecture would have very little original code - hence little to document and debug to that respect, fast response time, scalable design, without sacrificing on security
