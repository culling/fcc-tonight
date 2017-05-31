exports.secrets = require("./../secrets/secrets.js");
module.exports = require('./env/' + process.env.NODE_ENV + '.js');
