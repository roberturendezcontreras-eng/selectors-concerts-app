require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventbriteService = require('./services/eventbriteService');
const concertRoutes = require('./routes/concerts');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Rutas
app.use('/api/concerts', concertRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: '✅ API activa',
    timestamp: new Date(),
    version: '1.0.0',
    apis: ['Ticketmaster', 'Eventbrite']
  });
});

// Estadísticas
app.get('/stats', (req, res) => {
  const stats = eventbriteService.obtenerEstadisticas();
  res.json(stats);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Error del servidor'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 Selectors App en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
