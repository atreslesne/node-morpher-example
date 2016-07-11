'use strict';

const Morpher = require('morpher-ru');
const Storage = require('./storage');

const parser = require('koa-bodyparser');
const morpher = new Morpher({
    login: 'liromot',
    password: 'HhcoS7pbtAn6zkPDTyUV'
}, new Storage());

function gender(value) {
    switch (value) {
        case 'neuter':
            return 'средний';
        case 'masculine':
            return 'мужской';
        case 'feminine':
            return 'женский';
        default:
            return 'не определено';
    }
}

function sex(value) {
    switch (value) {
        case 'male':
            return 'мужской';
        case 'female':
            return 'женский';
        default:
            return 'не определено';
    }
}

module.exports = function (router) {
    router.post('/declension', parser(), function *() {
        let result = yield morpher.declension(this.request.body['data']);

        let response = {
            result: [{
                field: 'В именительном падеже',
                value: `${result['именительный']} (${result['множественное']['именительный']})`
            }, {
                field: 'В родительном падеже',
                value: `${result['родительный']} (${result['множественное']['родительный']})`
            }, {
                field: 'В дательном падеже',
                value: `${result['дательный']} (${result['множественное']['дательный']})`
            }, {
                field: 'В винительном падеже',
                value: `${result['винительный']} (${result['множественное']['винительный']})`
            }, {
                field: 'В творительном падеже',
                value: `${result['творительный']} (${result['множественное']['творительный']})`
            }, {
                field: 'В предложном падеже',
                value: `${result['предложный']} (${result['множественное']['предложный']})`
            }]
        };

        if (result['род'] != 'unknown') response.result.push({ field: 'Род', value: gender(result['род']) });
        if ('где' in result) response.result.push({ field: 'Где', value: result['где'] });
        if ('куда' in result) response.result.push({ field: 'Куда', value: result['куда'] });
        if ('откуда' in result) response.result.push({ field: 'Откуда', value: result['откуда'] });

        this.body = response;
    });

    router.post('/declension/name', parser(), function *() {
        let result = yield morpher.declensionName(this.request.body['data']);

        let response = {
            result: [{
                field: 'В именительном падеже',
                value: result['именительный']
            }, {
                field: 'В родительном падеже',
                value: result['родительный']
            }, {
                field: 'В дательном падеже',
                value: result['дательный']
            }, {
                field: 'В винительном падеже',
                value: result['винительный']
            }, {
                field: 'В творительном падеже',
                value: result['творительный']
            }, {
                field: 'В предложном падеже',
                value: result['предложный']
            }]
        };

        if ('sex' in result) response.result.push({ field: 'Пол', value: sex(result['пол']) });

        this.body = response;
    });

    router.post('/declension/number', parser(), function *() {
        if (this.request.body['data'].length !== 2) throw new Error('Требуется число и единица измерения');

        let result = yield morpher.declensionNumber(this.request.body['data'][0], this.request.body['data'][1]);

        this.body = {
            result: [{
                field: 'В именительном',
                value: result['именительный']
            }, {
                field: 'В родительном',
                value: result['родительный']
            }, {
                field: 'В дательном',
                value: result['дательный']
            }, {
                field: 'В винительном',
                value: result['винительный']
            }, {
                field: 'В творительном',
                value: result['творительный']
            }, {
                field: 'В предложном',
                value: result['предложный']
            }]
        };
    });
};
