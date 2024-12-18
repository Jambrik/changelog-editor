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


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/dist/en-US/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

router.route('/changelog/load/:program_id/:version')
  .get(function (req, res) {
    var param = {
      programId: req.params.program_id,
      version: req.params.version
    }
    let cl = changeLogDao.changeLogLoad(param);
    res.json(cl);
  });

  router.route('/changelog/config/get')
  .get(function (req, res) {
    let config = configDao.mainConfigLoad();    
    res.json(config);  

  });


  router.route('/changelog/write/')
  .post(function (req, res) {    
    var param = {
      programId: req.body.programId,
      version: req.body.version,
      item: req.body.item
    }
    changeLogDao.changeLogSave(param);    
    res.json({done: true});
  });

  router.route('/changelog/delete/')
  .post(function (req, res) {    
    var param = {
      programId: req.body.programId,
      version: req.body.version,
      id: req.body.id
    }
    changeLogDao.changeLogDelete(param);    
    res.json({done: true});
  });

  router.route('/changelog/release/')
  .post(function (req, res) {    
    var param = {
      programId: req.body.programId,
      version: req.body.version,
      releaseDate: req.body.releaseDate
    }
    changeLogDao.changeLogRelease(param);    
    res.json({done: true});
  });

router.route('/changelog/versions/:program_id/')
  .get(function (req, res) {    

    var param = {
      programId: req.params.program_id,
    }    
    changeLogDao.changeLogVersions(param, res);    
  });

  router.route('/changelog/new-version/:program_id/:version')
  .get(function (req, res) {            
    changeLogDao.newVersion(req.params.program_id, req.params.version);    
    res.json({done: true});
  });

  router.route('/translate/')
  .post(function (req, res) {    
    
    translate.translate(req.body.text, req.body.from, req.body.to, res);    
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
app.use('/rest', router);

app.use(function (req, res, next) {
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
