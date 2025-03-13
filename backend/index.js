const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotnev = require('dotenv');
const db = require('./dbConnection');

const upload = require('./upload');
const register = require('./registration');
const login = require('./login');

dotnev.config({ path: './backend/.env' });

    const app = express();
    app.use(
      bodyparser.json({
        extended: true,
        limit: '35mb',
        parameterLimit: 50000,
      }),
    );

app.use(cors());
app.use('/', upload);
app.use('/', login);
app.use('/', register);

app.listen(3000, () => {
  console.log('Server running ...');
})