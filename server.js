const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDataBase = require('./config/database');
require('dotenv').config();

connectDataBase();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(bodyParser.json());

// Routes
const productRoutes = require('./routes/product');
const posterRoutes = require('./routes/poster');
const authorRoutes = require('./routes/auth');

app.use('/api/products', productRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/auth', authorRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
