'use strict';

const winston = require('winston');

const transport = new winston.transports.Console({
    level: 'verbose',
    silent: false,
    timestamp: false
});

const customFormat = winston.format.printf(info => {
    return `${info.level}: ${info.message}`;
});

const format = winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.colorize(),
    winston.format.timestamp(),
    customFormat
);

const logger = winston.createLogger({ transports: transport, format: format });

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;
