'use strict';

const myUtils = require('./util');
const config = myUtils.getConfig();
const logger = myUtils.getLogger();
const db = require('./db');
const Slack = require('slack-node');

const moment = require('moment');

// -----------------------------------------------------------------------------
// Interrupts
// -----------------------------------------------------------------------------

process.on('uncaughtException', function(err) {
    logger.fatal(err);
    process.exit(1);
});

// -----------------------------------------------------------------------------
// Main block
// -----------------------------------------------------------------------------

let today = moment();
let day = today.format('D');
let month = today.format('M');

logger.info('Looking for birthdays for %d/%d...', day, month);

db.query('select * from Birthdays where month = ? and day = ?', [month, day])
.then((rows) => {

    db.cleanUp();
    logger.debug(rows);

    if (rows && rows.length > 0) {
        return wishHappyBirthday(rows);
    } else {
        logger.info('No cake today');
        Promise.resolve();
    }
})
.then(() => {
    logger.info('Good bye');
})
.catch((err) => {
    logger.error(err);
});

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

function buildMessage(rows) {

    let messageText;

    if (rows.length === 1) {
        messageText = `Today we celebrate the birthday of *${rows[0].name}*. Happy birthday! :balloon:`;
    } else {
        messageText = `Today we celebrate the birthdays of:\n\n`;

        rows.forEach((item) => {
            messageText += `* ${item.name}\n`;
        });

        messageText += `\nHappy birthday everyone! :balloon: :banana_dance:`;
    }

    return messageText;

}

function wishHappyBirthday(rows) {

    return new Promise((resolve, reject) => {

        let message = buildMessage(rows);
        let webhookUri = config.slack.webhookUri;

        let slack = new Slack();
        slack.setWebhook(webhookUri);

        let slackOptions = {
            channel: config.slack.channel,
            text: message
        };

        slack.webhook(slackOptions, function(err) {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
