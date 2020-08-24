import Service from './service';

const port = process.env.PORT || '7000';

const service = new Service({
  port : port
});

service.start();