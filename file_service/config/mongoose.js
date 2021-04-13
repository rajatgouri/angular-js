'use strict';

const mongoose = require('mongoose');
const config = require('./config');

const options = {
    useNewUrlParser: true,
    family: 4
};

options.auth = config.db.user ? {
    user: config.db.user,
    password: config.db.password
} : null;

module.exports = () => {
    mongoose.connect(config.db.url, options);
};
