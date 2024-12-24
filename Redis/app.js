const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;

// Create Redis client (v4+)
const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Log successful connection
redisClient.on('connect', () => {
  console.log('Attempting to connect to Redis...');
});

// Log when Redis is ready
redisClient.on('ready', () => {
  console.log('Redis client is ready to use!');
});

// Connect Redis client
redisClient.connect();

// Initialize Express application
const app = express();

// Set up session middleware to use Redis for session storage
app.use(
  session({
    store: new RedisStore({ client: redisClient }), // Redis store for session management
    secret: 'mySuperSecretKey',                     // Secret used to sign the session ID cookie
    resave: false,                                  // Do not resave session if it hasn't changed
    saveUninitialized: false,                       // Do not save uninitialized sessions
    cookie: {
      secure: false,   // Set to `true` if using HTTPS (for local testing, we use `false`)
      httpOnly: true,  // Ensure the cookie is not accessible via JavaScript
      maxAge: 1000 * 60 * 10 // Session expiration time (10 minutes)
    }
  })
);

// Route to test session creation and increment a session counter
app.get('/', (req, res) => {
  if (!req.session.counter) {
    req.session.counter = 1; // Initialize session counter
    res.send('Welcome! You have visited this page 1 time.');
  } else {
    req.session.counter++; // Increment counter in session
    res.send(`You have visited this page ${req.session.counter} times.`);
  }
});

// Route to reset session
app.get('/reset', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not reset session');
    }
    res.send('Session reset.');
  });
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
