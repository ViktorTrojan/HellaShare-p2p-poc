import pino from 'pino';
import pretty from 'pino-pretty'
import path from 'path';
import fs from 'fs';
const logDirectory = path.join(path.dirname("log"), 'logs');

if (!fs.existsSync(logDirectory)) {
     fs.mkdirSync(logDirectory);
}

const dateForFile = `${new Date().toLocaleString('en-GB').replace(/[/:]/g, '.').replace(", ", "-")}_log.log`;

const streams = [
    { stream: pretty({ colorize: true }) },
    { stream: pino.destination({ dest: path.join(logDirectory, dateForFile), append: true }) }
];

const Logger = pino({}, pino.multistream(streams))

export { Logger }