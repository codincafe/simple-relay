/********************************************************/
/***** Model Initi *****/
/********************************************************/
const dbConnect = require('../dbConnect');
const logger = require('../logger');

module.exports = {
    Users: require('./Users')(dbConnect, logger)
}