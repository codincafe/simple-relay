/********************************************************/
/***** User Model *****/
/********************************************************/
const bcrypt = require('bcrypt');

const Users = (connection, logger) => {
    const module = {}

    /* Login methods */
    module.Login = (username, password, callback) => {
        connection.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username], (err, user) => {
            if (err) {
                logger.error.error(err)
                callback(err)
            } else {
                const comparePass = bcrypt.compareSync(password, user[0].password);
                if (comparePass) {
                    callback(false, {success: true,
                        user: user[0]})
                } else {
                    callback(true, {success: false,
                        code: '001'})
                }
            }
        })
    }

    return module;
};

module.exports = Users