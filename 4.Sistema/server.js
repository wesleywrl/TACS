'use strict';

// ================================================================
// get all the tools we need
// ================================================================
const dotenv = require('dotenv');
const result = dotenv.config()
if (result.error) {
  console.log('RESUL ERROR HERE', result.error);
}

const express = require('express');
const session = require('express-session');
const log4js = require('log4js');
log4js.configure({
  appenders: { systemlog: { type: "file", filename: "logs/systemlog.log" } },
  categories: { default: { appenders: ["systemlog"], level: "error" } }
});


const routes = require('./routes/index.js');
const routesProduct = require('./routes/product.js');
const routesLog = require('./routes/logs.js');
const routesUsuario = require('./routes/usuario');
const routesAuth = require('./routes/auth.js');

const logger = log4js.getLogger('systemlog');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: false }))

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhhH, very secret'
}));

// Session-persisted message middleware

app.use(function (req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

const restrict = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Acesso negado!';
    res.redirect('/login');
  }
}


// ================================================================
// setup our express application
// ================================================================
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');


// ================================================================
// setup routes
// ================================================================
routesAuth(app, logger);
routesProduct(app, restrict, logger);
routesLog(app, restrict, logger);
routesUsuario(app, restrict, logger);
routes(app, restrict, logger);

// ================================================================
// start our server
// ================================================================
app.listen(port, function () {
  console.log('Server listening on port ' + port + '...');
});