const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Get the absolute path to the backend directory
const backendDir = process.cwd();
const logDir = path.join(backendDir, 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`📁 Created logs directory at: ${logDir}`);
}

// Define log file paths
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

console.log(`📝 Error log will be written to: ${errorLogPath}`);
console.log(`📝 Combined log will be written to: ${combinedLogPath}`);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'task-manager-api' },
  transports: [
    // Write all errors to error.log
    new winston.transports.File({ 
      filename: errorLogPath,
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: combinedLogPath,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // Also log to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    })
  ]
});

// Test log to verify file writing
logger.info('✅ Logger initialized successfully');
logger.error('⚠️ This is a test error message');

module.exports = logger;