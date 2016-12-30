module.exports = {
    database: {
        host: '127.0.0.1',
        user: 'user',
        password: 'secret',
        database: 'Birthday',

        // The maximum number of connections to open in the pool
        connectionLimit: 50,

        // Should we be able to run multiple statements in one query? This must be `true`.
        multipleStatements: true
    },
    logger: {
        // This name appears in the log file making it possible to log to a communal log file
        name: 'birthday-announcer',

        // Preferred level. Available levels are: fatal, error, warn, info, debug, trace
        level: 'trace',

        // Show the file name and line number that issued the log message? There is overhead required when this
        // is set to `true`, but the benefit is that you know which file and line number issued the log message.
        src: false
    },
    slack: {
        webhookUri: 'https://hooks.slack.com/services/{your-token}',
        channel: '#{your-channel}'
    }
};
