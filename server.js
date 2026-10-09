const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Cloud 100% Succesfully Connected!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Register Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const odooRoutes = require('./routes/odoo');
app.use('/api/odoo', odooRoutes);

// Base Route Test
app.get('/', (req, res) => {
  res.send('Odoo Live Backend Server & MongoDB Hojjechaa Jira!');
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('Fayyadamaan Socket-n hidhame ID:', socket.id);

  socket.on('disconnect', () => {
    console.log('Fayyadamaan addaan cite');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server Odoo Live Port ${PORT} irraatti ka'eera!`);
});
