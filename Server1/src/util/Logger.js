const pino = require('pino');
const pretty = require('pino-pretty');
const path = require('path');
const fs = require('fs');

const logDirectory = path.join(path.dirname("log"), 'logs');

// create log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const dateForFile = `${new Date().toLocaleString('en-GB').replace(/[/:]/g, '.').replace(", ", "-")}_log.log`;

const streams = [
    { stream: pretty({ colorize: true }) },
    { stream: pino.destination({ dest: path.join(logDirectory, dateForFile), append: true }) }
];

const Logger = pino({}, pino.multistream(streams))

module.exports = Logger;