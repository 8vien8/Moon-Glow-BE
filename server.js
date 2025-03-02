const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDataBase = require('./config/database');

// Load environment variables from.env file
require('dotenv').config();

//connect to database
connectDataBase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// // Router
// const homeRoutes = require('.routes/home');
const productRoutes = require('./routes/product');
const posterRoutes = require('./routes/poster');

// // Routes
// app.use('.api/home', homeRoutes)
app.use('/api/products', productRoutes);
app.use('/api/posters', posterRoutes);

// test routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Catch undefined routes
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

