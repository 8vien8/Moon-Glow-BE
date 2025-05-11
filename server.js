const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const connectDataBase = require('./config/database');
require('dotenv').config();

connectDataBase();

const app = express();

// Middleware
const allowedOrigins = [
    process.env.FRONT_END_URL, // local dev
    process.env.CLIENT_URL // frontend production
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

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
