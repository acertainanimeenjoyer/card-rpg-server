// server/server.js

require('dotenv').config();               // Load .env variables first
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Create the Express app
const app = express();

// ➡️ Middleware
app.use(express.json());                  // Parse JSON bodies

// ➡️ Database connection (adjust URI in .env as MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
  // optional mongoose options
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ➡️ Route imports
const gameRoutes     = require('./routes/gameRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const cardRoutes     = require('./routes/cardRoutes');     // if you have one
const authRoutes     = require('./routes/authRoutes');     // updated

// ➡️ Mount routes
app.use('/api/auth',    authRoutes);
app.use('/api/game',    gameRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/cards',   cardRoutes);                       // mount your card editor API

// ➡️ (Optional) Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// ➡️ Root health-check
app.get('/', (req, res) => {
  res.send('🎮 Card RPG Server is running');
});

// ➡️ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ➡️ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
