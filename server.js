var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();              // get an instance of the express Router
var changeLogDao = require('./server-modules/change-log.dao');
var configDao = require('./server-modules/config.dao');
var app = express();
var morgan = require('morgan')
var converterDao = require('./server-modules/converter.dao');
var translate = require('./server-modules/translate');

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD');
  next(); // make sure we go to the next routes and don't stop here
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// test route to make sure everything is working (accessed at GET http://localhost:3333/api)
router.get('/', function (req, res) {
  res.json({ message: 'Welcome! It is a light weight change-log app-api!' });
});

router.route('/change-log-load/:program_id/:version')
  .get(function (req, res) {
    var param = {
      programId: req.params.program_id,
      version: req.params.version
    }
    let cl = changeLogDao.changeLogLoad(param);
    res.json(cl);
  });

  router.route('/change-log-write/')
  .post(function (req, res) {
    console.log(req.body);
    var param = {
      programId: req.body.programId,
      version: req.body.version,
      item: req.body.item
    }
    changeLogDao.changeLogSave(param);    
    res.json({done: true});
  });

  router.route('/change-log-delete/')
  .post(function (req, res) {
    console.log(req.body);
    var param = {
      programId: req.body.programId,
      version: req.body.version,
      id: req.body.id
    }
    changeLogDao.changeLogDelete(param);    
    res.json({done: true});
  });

router.route('/versions/:program_id/')
  .get(function (req, res) {
    console.log("versions call");

    var param = {
      programId: req.params.program_id,
    }
    console.log("versions call program_id: " + req.params.program_id);
    changeLogDao.changeLogVersions(param, res);    
  });

  router.route('/translate/')
  .post(function (req, res) {
    console.log(req.body);
    
    translate.translate(req.body.text, req.body.from, req.body.to, res);    
  });

router.route('/config')
  .get(function (req, res) {
    let config = configDao.mainConfigLoad();    
    res.json(config);  

  });


  router.route('/convert-all')  
  .get(function (req, res) {
    converterDao.convertAll();
    res.json({
      done: true
    });  

  });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public

app.use(logger('dev'));
app.use(morgan('combined'));
app.use(favicon('favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("A kért oldal nem található!");
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3333);
module.exports = app;
