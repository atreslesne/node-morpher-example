'use strict';

const Morpher = require('morpher-ru');

const util = require('util');
const path = require('path');
const Datastore = require('nedb');

function Storage() {
    this.db = {
        text: new Datastore({ filename: path.join(__dirname, '..', 'storage.text.db'), autoload: true }),
        name: new Datastore({ filename: path.join(__dirname, '..', 'storage.name.db'), autoload: true }),
        number: new Datastore({ filename: path.join(__dirname, '..', 'storage.number.db'), autoload: true })
    };
}
util.inherits(Storage, Morpher.Storage);

Storage.prototype.get = function (type, hash) {
    return new Promise((resolve, reject) => {
        this.db[type].findOne({ hash: hash }, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    });
};

Storage.prototype.set = function (type, hash, value) {
    return new Promise((resolve, reject) => {
        value['hash'] = hash;
        this.db[type].insert(value, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }
        });
    });
};

Storage.prototype.contains = function (type, hash) {
    return new Promise((resolve, reject) => {
        this.db[type].count({ hash: hash }, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count > 0);
            }
        });
    });
};

module.exports = Storage;
