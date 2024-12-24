const redis = require('redis');

// Create a Redis client using the updated API (v4+)
const redisClient = redis.createClient({
  url: 'redis://localhost:6379' // Redis server hostname and port
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err); // Logs if there's an error
});

// Log successful connection
redisClient.on('connect', () => {
  console.log('Attempting to connect to Redis...');
});

// Log when Redis is ready
redisClient.on('ready', () => {
  console.log('Redis client is ready to use!');
  
  // Test setting a value in Redis (using promises)
  redisClient.set('myKey', 'Hello Redis!').then((reply) => {
    console.log('Set key reply:', reply); // Should log 'OK'

    // Test retrieving the value from Redis (using promises)
    return redisClient.get('myKey');
  }).then((value) => {
    console.log('Retrieved value from Redis:', value); // Should log 'Hello Redis!'

    // Close the connection
    redisClient.quit();
  }).catch((err) => {
    console.error('Redis operation error:', err);
  });
});

// Connect to the Redis server
redisClient.connect();
