// filename - index.js 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/mongooseConfig');
const { PORT } = require('./constants/constants');

const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});