'use strict';

const koa = require('koa');
const router = require('koa-router')();
const serve = require('koa-static');

const app = koa();
const routes = require('./src/routes');

app.use(function *(next) {
    try {
        yield next;
    } catch (err) {
        this.body = {
            error: err.message
        }
    }
});

routes(router);

app.use(router.routes()).use(router.allowedMethods()).use(serve('./public'));
app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0');
