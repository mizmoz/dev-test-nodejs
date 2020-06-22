import express = require('express');
import parser = require('body-parser');

import country_func from './api/country';
import auth from './api/authenticate';
import redis from './configs/redis';
import { Country } from './types';

const app: express.Application = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

// #2
app.get('/countries', (req, res) => {

    function _proceed() {

        redis.keys('*', (err, keys) => {
            if (err) return _send_response(400, { message: 'request rejected' });

            if (keys.length == 0) return _load_json();

            let list: any[] = [];

            for (const key of keys) {
                redis.get(key, (err, reply) => {
    
                    if (reply) {
                        list.push(JSON.parse(reply));
                    }else{
                        list.push({ code: key, population: 0 });
                    }
    
                    if (list.length == keys.length) {
                        _sort(list, true);
                    }
                });
            }
        });
    }

    function _sort(countries: any[], desc: boolean) {

        const sorted = countries.sort((e1, e2) => {
            return e1.name.localeCompare(e2.name);
        });

        _send_response(200, sorted);
    }

    function _load_json() {

        country_func()
        .then(ctry => {
            _add_to_db(ctry);
        })
        .catch(err => {
            _send_response(400, { message: 'request rejected' });
        });
    }

    function _add_to_db(c_temp: Country[]) {
        let counter: number = 0;

        for (const c of c_temp) {
            const tmp = JSON.stringify({ name: c.name, code: c.code, population: 0 });

            redis.set(c.code, tmp, (err, reply) => {
                counter += 1;

                if (counter == c_temp.length) {
                    _send_response(200, c_temp);
                }
            });
        }
    }

    function _send_response(code: number, data: any) {

        res
            .status(code)
            .send(data)
            .end();
    }

    _proceed();
});

// #3
app.get('/countries/populations', (req, res) => {

    const order = req.query.desc;

    function _proceed() {

        const desc: boolean = Boolean(Number(order));

        redis.keys('*', (err, keys) => {
            if (err) return _send_response(400, { message: 'request rejected' });
    
            let list: any[] = [];

            for (const key of keys) {
                redis.get(key, (err, reply) => {
    
                    if (reply) {
                        list.push(JSON.parse(reply));
                    }else{
                        list.push({ code: key, population: 0 });
                    }
    
                    if (list.length == keys.length) {
                        _sort(list, desc); // done
                    }
                });
            }
        });
    }

    function _sort(countries: any[], desc: boolean) {

        const sorted = countries.sort((e1, e2) => {
            return _compare(e1.population, e2.population, desc);
        });

        _send_response(200, sorted);
    }

    function _compare(a: number, b: number, desc: boolean) {

        if (desc) {
            return b - a;
        }else{
            return a - b;
        }
    }

    function _send_response(code: number, data: any) {

        res
            .status(code)
            .send(data)
            .end();
    }

    _proceed();
});

// #4, #5
app.put('/countries/:code', (req, res) => {

    const code: string = req.params.code;
    const body = req.body;

    function _proceed() {

        if (code) {
            
            _load_previous(code, prev_country => {

                let data: any = { ...prev_country };
                
                const keys = Object.keys(body);
                for (const key of keys) {
                    if (key == 'code') continue; // skip

                    if (body.hasOwnProperty(key)) {
                        data[key] = body[key];
                    }
                }

                redis.set(code, JSON.stringify(data), (err, reply) => {
    
                    if (reply) {
                        _send_response(200, { message: 'country updated' });
                    }else{
                        _send_response(400, { message: `failed to update country`, error: err });
                    }
                });
            });
        }else{
            _send_response(400, { error: 'invalid data' });
        }
    }

    function _load_previous(code: string, cb: (data: any) => void) {

        redis.get(code, (err, reply) => {
    
            if (reply) {
                cb(JSON.parse(reply));
            }else{
                cb({ code, population: 0 });
            }
        });
    }

    function _send_response(code: number, data: any) {

        res
            .status(code)
            .send(data)
            .end();
    }

    _proceed();
});

app.delete('/countries/:code', (req, res) => {

    const code: string = req.params.code;

    function _proceed() {

        redis.del(code, (err, reply) => {

            if (reply) {
                _send_response(200, { message: 'country deleted' });
            }else{
                _send_response(400, { message: 'failed to delete country', error: err });
            }
        });
    }

    function _send_response(code: number, data: any) {

        res
            .status(code)
            .send(data)
            .end();
    }

    _proceed();
});

// create user
app.post('/login/new', (req, res) => {

    const body = req.body;

    function _proceed() {

        if (body.hasOwnProperty('username') && body.hasOwnProperty('password')) {
            
            _check_if_exists(body.username, body.password);
        }
    }

    function _check_if_exists(username: string, password: string) {

        redis.get(username, (err, reply) => {

            if (reply) {
                _send_response(400, { message: 'already exists' });
            }else{
                _create(username, password)
            }
        });
    }
    
    function _create(username: string, password: string) {

        // hash pwd in real app
        redis.set(username, password, (err, reply) => {

            if (reply) {
                _send_response(200, { message: 'account created' });
            }else{
                _send_response(400, { message: 'invalid format' });
            }
        });
    }

    function _send_response(code: number, data: any) {

        res
            .status(code)
            .send(data)
            .end();
    }

    _proceed();
});

// login
app.post('/login', (req, res) => {

    const body = req.body;

    function _proceed() {

        if (body.hasOwnProperty('username') && body.hasOwnProperty('password')) {
            
            auth(body.username, body.password)
                .then(success => {
                    success ? _send_response(200, { message: 'user has logged in' }) : _send_response(400, { message: 'invalid credentials' });
                });
        }
    }

    function _send_response(code: number, data: any) {

        res
            .status(code)
            .send(data)
            .end();
    }

    _proceed();
});

app.put('*', (req, res) => {

    res
        .status(200)
        .send({ message: 'nothing to do here' })
        .end();
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
