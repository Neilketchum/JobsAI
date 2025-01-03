// filename - index.js 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/mongooseConfig');
const { PORT } = require('./constants/constants');

const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});