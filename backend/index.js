// filename - index.js
const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./constants/constants');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('./config/mongooseConfig');

const routes = require('./routes');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://jobsai-878fa.web.app'], // Update with your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/', routes);

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// WebSocket logic
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Echo: ${message}`); // Echoing back the message
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
