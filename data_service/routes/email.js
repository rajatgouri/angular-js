'use strict';

const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const nodemailer = require('nodemailer');
const config = require('../config/config');

async function sendEmail (dstUserId, subject, message) {
    if (!dstUserId || !subject || !message) {
        return;
    }
    const user = await db.User.findOne({
        where: { id: dstUserId }
    });
    if (!user.email) {
        return;
    }
    const transport = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.username,
            pass: config.email.pass
        }
    });
    const options = {
        from: config.email.from,
        to: user.email,
        subject: subject,
        html: message
    };
    transport.sendMail(options, (error, info) => {
        if (error) {
            winston.error(error);
        } else {
            winston.info('Email sent: ' + info.response);
        }
    });
};

module.exports = {
    sendEmail: sendEmail
};
