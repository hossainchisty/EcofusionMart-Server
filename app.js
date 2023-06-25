// Basic Lib Imports
const cors = require('cors');
const express = require('express');
const passport = require("passport");
const bodyParser = require('body-parser');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { errorHandler } = require('./middleware/errorMiddleware');
// Database connection with mongoose
const connectDB = require('./config/db');
connectDB();

require('./config/passportConfig');


// Routing Implement
const seedRouters = require('./routes/seedRouters');
const userRouters = require('./routes/userRouters');
const sellerRouters = require('./routes/sellerRouters');
const productRouters = require('./routes/productRouters');
const adminRouters = require('./routes/adminRouters');
const reviewRouters = require('./routes/reviewRouters');
const socialRouters = require('./routes/socialAuthRouters');
const cartRouters = require('./routes/cartRouters');
const orderRouters = require('./routes/orderRouters');
const wishlistRouters = require('./routes/wishlistRouters');

const app = express();
const http = require('http');

const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
  secret: 'somethingsecretgoeshere',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());

// app.use(
//   cors({
//     origin: 'http://127.0.0.1:5173',
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     methods: ['GET', 'PUT', 'POST', 'DELETE'],
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     maxAge: 3600,
//   })
// );

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173/', // Replace with your frontend application URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));


app.use(
  express.urlencoded({
    extended: false,
  })
);

// Routing Implement
app.get('/', (req, res) => {
  res.send('Hello, welcome to our shop!');
});

app.use('/api/seed', seedRouters);
app.use('/api/v2/users/auth/', userRouters);
app.use('/api/v1/seller', sellerRouters);
app.use('/api/v1/products', productRouters);
app.use('/api/v1/admin', adminRouters);
app.use('/api/v1/reviews', reviewRouters);
app.use('/api/v1/social', socialRouters);
app.use('/api/v1/cart', cartRouters);
app.use('/api/v1/order', orderRouters);
app.use('/api/v1/wishlist', wishlistRouters);

// Undefined Route Implement
app.use('*', (req, res) => {
  res.status(404).json(
    { message: 'API endpoint not found.', }
  );
});

// Custome error handler
app.use(errorHandler);

module.exports = app;
