'use strict';
import countries from "../configs/country";
import { Country } from "../types";
import { callbackify } from "util";

const fs = require('fs');
const os = require('os');
const path = require('path');
var redis = require('redis');
let jsonData = require('../configs/countries.json');

module.exports = {

  tsNotJson: function () {
    var arraysv = Array();
    var props = Object.keys(countries);
    var result = props.map(function(prop){
      arraysv.push(countries[prop].name);
    });
    return(arraysv);
  },  
  
  countryList: function () {
    var jstring = JSON.stringify(jsonData);
    var obvalue = JSON.parse(jstring);
    var props = Object.keys(obvalue);
    var arraysu = Array();
    var result = props.map(function(prop){
    arraysu.push(obvalue[prop].name);
  });
  return(arraysu);
  },

  nowAddCountry: function (reqbody) { 
    const filepath = path.resolve('../dev-test-nodejs/src/configs', 'countries.json');
    var bufferText = JSON.stringify(reqbody);
    fs.appendFile(filepath, bufferText, (err) => {
      if(err) {
          console.log(err);
      } 
    });
    return('file updated .... ');  
  },

  authList: function (user, pass) {
    var usr = user;
    var pwd = pass;
    var flagx = 'Access Denied';
    var redisClient = redis.createClient({host : 'localhost', port : 6379});
    var accessx = user+'access';
    redisClient.hset('authlist',accessx,flagx);
    var isAuthenticated = function(listname,key,callback){
      redisClient.hget(listname, key,callback);  
    }
    isAuthenticated('authlist',usr,function(err1,result1){
    {if (pwd == result1){
      flagx = 'Access Granted';
      redisClient.hset('authlist',accessx,flagx);
      console.log(flagx);
      }};
    });
    return 'Authenticated';
  }
}