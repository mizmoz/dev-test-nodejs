'use strict';
const cc = require('./api/country')
const express = require('express')
var bodyParser = require('body-parser');
const app = express()
const port = 3000
app.get('/countries', (request,response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(cc.countryList());
});
app.use(bodyParser.json());
app.post('/addcountry', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(cc.nowAddCountry(request.body));
});
app.get('/authList/:user/:password', (request,response) => {
    var usr = request.params.user;
    var pwd = request.params.password;
    response.setHeader('Content-Type', 'application/json');
    response.send(cc.authList(usr,pwd));  
});
app.listen(port, (err:any) => {
  if (err) {
    return console.log('not cool!', err)
  }
  console.log(`yep on ${port}`)
})