module.exports = {

    /**
     * Sanitize Phone Number
     */
    ValidateEmail (mail) {
        if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(mail)) {
            return true;
        }
        return false;

    }
};