'use strict';

const constants = require('./constants');
const bunyan = require('bunyan');
const fs = require('fs');

let config = null;
let logger = null;

function getConfig() {
    if (config) {
        return config;
    } else {

        const env = process.env[constants.ENVIRONMENT_VARIABLE];

        if (env === 'development') {
            try {
                let stat = fs.statSync('config/private.js');

                if (stat.isFile()) {
                    config = require('../config/private.js');
                } else {
                    config = require('../config/development.js');
                }
            } catch (err) {
                config = require('../config/development.js');
            }
        } else {
            config = require('../config/' + (env || 'development') + '.js');
        }

        return config;
    }
}

function getLogger() {

    if (!logger) {
        logger = bunyan.createLogger(getConfig().logger);
    }

    return logger;
}

// -----------------------------------------------------------------------------
// Module exports
// -----------------------------------------------------------------------------

module.exports = {
    getConfig,
    getLogger
};
