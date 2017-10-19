/*!
* express-flash-notification-example
* Copyright(c) 2017 Carlos Ascari Gutierrez Hermosillo
* MIT License
*/

const path = require('path');
const http = require('http');
const express = require('express');
const session = require('express-session');
const HoganExpress = require('hogan-express');
const flash = require('express-flash-notification');

const PORT = 8080;
const app = express();

// Configure Express to use HoganExpress rendering engine.
app
.set('views', path.resolve('app/views'))
.set('view engine', 'html')
.engine('html', HoganExpress)
.disable('view cache')

// Configure Express to use ejs rendering engine.
// app
// .set('views', path.resolve('app/views'))
// .set('view engine', 'ejs')
// .disable('view cache')

// Static Files (CSS) will serve style.css
.use(express.static(path.resolve('app/public')))

// Session Middleware REQUIRED
app.use(session({
  name: 'example',
  secret: 'shuush',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    expires: new Date('Monday, 18 January 2028')
  },
}))

// -----------------------------------------------------------------------------

const flashNotificationOptions = {
  beforeSingleRender: function(item, callback) {
    if (item.type) {
      switch(item.type) {
        case 'GOOD':
          item.type = 'Success';
          item.alertClass = 'alert-success';
          break;
        case 'OK':
          item.type = 'Info';
          item.alertClass = 'alert-info';
          break;
        case 'BAD':
          item.type = 'Error';
          item.alertClass = 'alert-danger';
          break;
      }
    }
    callback(null, item);
  }
};

// Flash Notification Middleware Initialization
app.use(flash(app, flashNotificationOptions))

// -----------------------------------------------------------------------------

// Index, all flash notification will be rendered here.
app.get('/', (req, res) => res.render('layout'));

// -----------------------------------------------------------------------------

app.get('/alert-1-good', function(req, res) {
  req.flash('GOOD', 'MESSAGE', '/');
})

app.get('/alert-1-ok', function(req, res) {
  req.flash('OK', 'MESSAGE', '/');
})

app.get('/alert-1-bad', function(req, res) {
  req.flash('BAD', 'MESSAGE', '/');
})

// Multiple notifications
app.get('/alert-3-good', function(req, res) {
  req.flash('GOOD', 'MESSAGE', false); // false == dont redirect now.
  req.flash('GOOD', 'MESSAGE', false);
  req.flash('GOOD', 'MESSAGE', '/');
})

// -----------------------------------------------------------------------------

// Start the Server
http
.createServer(app).listen(PORT, function(){
  console.log(
    '[HTTP] running on port %s, with pid: %s', 
    PORT, 
    process.pid
  )
});
