const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check route (useful for hosting platforms)
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

// Simulated GPS location
let lat = 27.705; // Kathmandu latitude
let lng = 85.329; // Kathmandu longitude

// Send location updates every 2 seconds
setInterval(() => {
  lat += (Math.random() - 0.5) * 0.001;
  lng += (Math.random() - 0.5) * 0.001;

  io.emit('location-update', { lat, lng });

  console.log(`Location update → Lat: ${lat}, Lng: ${lng}`);
}, 2000);

// Socket connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Dynamic port for deployment
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});