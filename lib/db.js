'use strict';

const myUtils = require('./util');
const config = myUtils.getConfig();
const logger = myUtils.getLogger();

const mysql = require('mysql');
const pool = mysql.createPool(config.database);

function cleanUp() {
    return new Promise((resolve, reject) => {

        logger.trace('Ending database pool...');

        pool.end(() => {
            logger.trace('Clean-up complete');
            resolve();
        });
    });
}

function query(sql, bindings) {
    return new Promise((resolve, reject) => {
        let actualQuery = pool.query(sql, bindings, (err, rows) => {
            logger.trace('Query: %s', actualQuery.sql);

            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// -----------------------------------------------------------------------------
// Module exports
// -----------------------------------------------------------------------------

module.exports = {
    cleanUp,
    query
};
