var appRoot = require('app-root-path');
var winston = require('winston');

const logger = winston.createLogger({
	level: 'verbose',
	transports : [
		new winston.transports.Console({
			level: 'info',
			format: winston.format.combine(
				winston.format.timestamp({ format: 'HH:mm' }),
				winston.format.cli(),
				winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
			)
		}),
		new winston.transports.File({
			level: 'verbose',
			filename: `${appRoot}/logs/all.log`,
			format: winston.format.combine(
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss ZZ' }),
				winston.format.padLevels(),
				winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
			)
		})
	]
});

module.exports = logger;
