// Basic Lib Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
// Database connection with mongoose
const connectDB = require('./config/db');

connectDB();

// Routing Implement
const userRouters = require('./routes/userRouters');


const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    // TODO: Change this based on frontend configuration
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 3600,
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);

// Routing Implement
app.use('/api/v1/users', userRouters);

// Undefined Route Implement
app.use('*', (req, res) => {
  res.status(404).json({ status: 'fail', data: 'Not Found' });
});

// Custome error handler
app.use(errorHandler);

module.exports = app;
