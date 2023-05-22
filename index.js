const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routerv1 = require('./src/application/routes/v1');
const cors = require('cors');


const app = express();
app.use(
  cors({
    origin: '*',
  })
);

app.use(cookieParser());
app.use(session({
  secret: 'fhjgjfdghjbnbfdfdffd',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  console.log(`time: ${Date.now()}`);
  next();
});

app.use('/', routerv1);

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send({ message: 'terjadi kesalahan! :{' });
});

const PORT = 3000;
app.listen(PORT);
console.log('application running on port', PORT);

