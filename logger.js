const winston = require('winston');
const config = require('./config');

class loggerCreator {
    constructor(fileName) {
        const enumerateErrorFormat = winston.format(info => {
            if (info.meta instanceof Error) {
                return Object.assign({
                    isError: true,
                    message: info.message,
                    stack: info.meta.stack
                }, info);
            }

            if (info instanceof Error) {
                return Object.assign({
                    isError: true,
                    message: info.message,
                    stack: info.stack
                }, info);
            }

            if (info.message instanceof Error) {
                info.message = Object.assign({
                    isError: true,
                    message: info.message.message,
                    stack: info.message.stack
                }, info.message);
            }

            return info;
        });

        function consoleFormat() {
            const formatMessage = info => `${info.level} ${info.interactionId ? `- interactionId: ${info.interactionId} -` : ''} ${typeof info.message === 'object' ? JSON.stringify(info.message) : info.message} ${info.meta != null ? JSON.stringify(info.meta) : ''}`;
            const formatError = info => `${info.level} ${info.interactionId ? `- interactionId: ${info.interactionId} -` : ''} ${info.message}\n${info.stack}`;
            const format = info => `${info.timestamp} ${info.isError ? formatError(info) : formatMessage(info)}`;
            return winston.format.combine(winston.format.colorize(), winston.format.printf(format));
        }

        const logger = winston.createLogger({
            level: config.logLevel,
            exitOnError: false,
            transports: [
                new winston.transports.Console({
                    level: config.logLevel,
                    format: consoleFormat()
                }),
                new (require('winston-daily-rotate-file'))({
                    filename: './logs/%DATE%.' + fileName + '.log',
                    datePattern: 'YYYY-MM-DD',
                    createTree: true,
                    prepend: true,
                    level: config.logLevel,
                    format: winston.format.json()
                })
            ],
            format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), enumerateErrorFormat())
        });

        return logger;
    }
}

module.exports = loggerCreator;
