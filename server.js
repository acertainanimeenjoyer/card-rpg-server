const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cardRoutes = require('./routes/cardRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const enemyRoutes = require('./routes/enemyRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use('/api/cards', cardRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/enemies', enemyRoutes);
app.use('/api/game', gameRoutes);


// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');

// App setup
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('🧪 MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
        console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
}).catch(err => console.error('❌ MongoDB error:', err));
