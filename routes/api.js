/********************************************************/
/***** Dashboard Routes *****/
/********************************************************/
var express = require('express');
var router = express.Router();
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

router.post('/', (req, res, next) => {
    const { pin, status } = req.body;
    console.log(pin)
    console.log(status)

    var LED = new Gpio(pin, 'out');
    LED.writeSync(status);

    res.send({ success: true })
});

module.exports = router;
