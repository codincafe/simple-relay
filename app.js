/********************************************************/
/***** CRON *****/
/********************************************************/
// require('./cron/houseKeeping');

/********************************************************/
/***** Custom Requires *****/
/********************************************************/
const config = require('./config');
//const logger = require('./logger');

const Gpio = require('onoff').Gpio; // Gpio class
const led = new Gpio(16, 'out');       // Export GPIO17 as an output
 
// Toggle the state of the LED connected to GPIO17 every 200ms
const iv = setInterval(_ => led.writeSync(led.readSync() ^ 1), 200);
 
// Stop blinking the LED after 5 seconds
setTimeout(_ => {
  clearInterval(iv); // Stop blinking
  led.unexport();    // Unexport GPIO and free resources
}, 5000);

/********************************************************/
/***** Node Modules *****/
/********************************************************/
const fs = require('fs');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
// const csrf = require('csurf');
const fileUpload = require('express-fileupload');

/********************************************************/
/***** Require Routes *****/
/********************************************************/
// const index = require('./routes/index');
// const dashboard = require('./routes/dashboard');
const api = require('./routes/api');

/********************************************************/
/***** Spawn Express App *****/
/********************************************************/
const app = express();

/********************************************************/
/***** Production Settings *****/
/********************************************************/
if (config.app.env !== 'development') {
    var helmet = require('helmet');
    var minify = require('express-minify');
    var minifyHTML = require('express-minify-html');
    var uglifyEs = require('uglify-es');
    var compression = require('compression');
    app.use(compression());
    app.use(minify());
    app.use(minifyHTML({
        uglifyJsModule: uglifyEs,
        override: true,
        exception_url: false,
        htmlMinifier: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            minifyJS: true
        }
    }));
    app.use(helmet());
}

/********************************************************/
/***** Set View Engine For Express. *****/
/***** '/views' folder acts as *****/
/***** theme folder *****/
/********************************************************/
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

/********************************************************/
/***** Connect MYSQL *****/
/********************************************************/
// const dbCreds = {
//     host: config.db.host,
//     port: config.db.port,
//     database: config.db.name,
//     user: config.db.user,
//     password: config.db.password,
// }

/********************************************************/
/***** Configure Middlewares *****/
/********************************************************/
app.use(favicon(__dirname + '/public/images/favicon.ico'));
//app.use(logger.express);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

/* Configure Sessions in MySQL */
// const sessionStore = new MySQLStore(dbCreds);
// const sessionSecret = fs.readFileSync('./sessionSecret').toString();
// app.use(session({
//     store: sessionStore,
//     secret: sessionSecret,
//     resave: true,
//     saveUninitialized: true
// }));

app.use('/api', api);

/********************************************************/
/***** Init CSRF *****/
/********************************************************/
// app.use(csrf());

/********************************************************/
/***** Setup local functions *****/
/********************************************************/
app.use((req, res, next) => {
    req.uploadDir = config.app.uploadDir;
    req.Core = {
        Models: require('./models'),
        ErrorCodes: require('./errorCodes')
    };
    res.locals.session = req.session;
    // res.locals._csrf = req.csrfToken();
    // res.locals.csrf_html = '<input type="hidden" value="' + req.csrfToken() + '" name="_csrf" />';
    res.locals.formatDate = (date, format) => {
        let fDate = moment(date).format(format);
        return (fDate === 'Invalid date') ? '' : fDate;
    };
    res.locals.addStyle = (styles) => {
        let dep = '';
        if (typeof styles !== 'undefined') {
            styles.forEach((style) => {
                dep += '<link rel="stylesheet" href="' + style + '">'
            })
        }
        return dep;
    }
    res.locals.addScript = (script) => {
        let dep = '';
        if (typeof script !== 'undefined') {
            script.forEach((script) => {
                dep += '<script src="' + script + '"></script>'
            })
        }
        return dep;
    }
    next();
});

/********************************************************/
/******* Use this function as middleware in Route *******/
/******* to allow access to sessioned users *************/
/********************************************************/
const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/403');
    } else {
        next();
    }
}

/********************************************************/
/***** Define Routes *****/
/********************************************************/
/* APP ROUTES */
// app.use('/', index);
// app.use('/dashboard', checkAuth, dashboard);

/********************************************************/
/***** Logout and destroy all set sessions *****/
/********************************************************/
app.use('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

/********************************************************/
/***** Handle 404 Template *****/
/********************************************************/
app.use('/404', (req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/********************************************************/
/***** Handle 403 Template *****/
/********************************************************/
app.use('/403', (req, res) => {
    res.status(403)
    res.render('unauthorized', {
        title: 'Unauthorized Access'
    });
});

/********************************************************/
/***** Error Handlers *****/
/********************************************************/
if (config.app.env !== 'development') {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.render('error', {
            title: 'Error',
            status: err.status,
            message: err.message,
            error: err
        });
    });
} else {
    app.use((err, req, res, next) => {
        res.status(500).send(err.stack)
        //logger.error.error(err.stack)
        next()
    })
}

/********************************************************/
/***** Start Node app *****/
/********************************************************/
app.set('port', process.env.PORT || config.app.port);
app.listen(app.get('port'), () => {
	console.log('Server Start')
    //logger.info.info("UI started on Port " + app.get('port'));
});
