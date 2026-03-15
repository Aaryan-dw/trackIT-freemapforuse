const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Serve front-end

// Simulate device sending location every 2 seconds
let lat = 27.705; // Start lat (Kathmandu)
let lng = 85.329; // Start lng

setInterval(() => {
  // Randomly move a bit
  lat += (Math.random() - 0.5) * 0.001;
  lng += (Math.random() - 0.5) * 0.001;

  // Emit location to all connected clients
  io.emit('location-update', { lat, lng });
}, 2000);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});