'use strict';

const myUtils = require('./util');
const config = myUtils.getConfig();
const logger = myUtils.getLogger();
const sqlite = require('sqlite3');
const db = new sqlite.Database(config.database.filename);

logger.debug('sqlite3 client firing up...');

function cleanUp() {
    return new Promise((resolve, reject) => {
        logger.trace('Cleaning up...');
        db.close();
        resolve();
    });
}

function query(sql, bindings) {

    return new Promise((resolve, reject) => {

        logger.trace('Query: %s', sql);

        // This regex is the crux of `any-db-sqlite`. It has nothing more to offer
        // than this, so this is how I'm implementing it.
        if (sql.match(/^\s*(insert|update|replace)\s+/i)) {

            db.run(sql, bindings, (err, result) => {

                if (sql.match(/^\s*(insert)\s+/i)) {
                    db.all('select last_insert_rowid() as id', [], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ insertId: rows[0].id });
                        }
                    });
                } else {
                    resolve(result);
                }
            });
        } else {
            db.all(sql, bindings, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        }

    });
}

// -----------------------------------------------------------------------------
// Module exports
// -----------------------------------------------------------------------------

module.exports = {
    cleanUp,
    query
};
