const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./db/connect');
const socketHandlers = require('./socket/socketHandlers');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json()); 
connectDB();

// Use the API routes
app.use('/', routes); // This will handle /register and /login routes

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  },
});

// Initialize Socket.IO handlers
socketHandlers(io);

server.listen(3002, () => {
  console.log('Server is running on port 3002');
});
