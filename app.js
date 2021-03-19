var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const serveIndex = require('serve-index');
const axios = require('axios');
const cheerio = require('cheerio')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', serveIndex('public', { 'icons': true }));

// app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/yahoo', (req, res) => {
  axios.get('https://tw.yahoo.com/')
    .then(r => {
      // res.send(r.data);
      const ar = [];
      const $ = cheerio.load(r.data);
      // res.send($('img').eq(0).attr('src'));
      $('img').each((index, el) => {
        ar.push($(el).attr('src'));
      })
      res.send(ar.join('<br>'));
    })
});
// https://www.npmjs.com/package/puppeteer

app.get('/try-sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset= utf-8;',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  let id = 1;

  setInterval(function () {
    const now = new Date;
    res.write(`id: ${id++}\n`);
    res.write(`data: ${now.toLocaleString()}\n\n`);
  }, 2000);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

module.exports = app;
