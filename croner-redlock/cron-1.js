const Redis = require('redis');
const { Cron } = require('croner');

// Create a Redis client
const redisClient = Redis.createClient({ url: 'redis://localhost:6379' });

// Connect to Redis
redisClient.connect().then(() => {
  console.log("Cron-1: Redis client connected for test cron job");

  // Define a cron job that runs every 20 seconds (mimicking daily execution)
  const job = new Cron('*/20 * * * * *', async () => {
    let retries = 0;
    const maxRetries = 2;
    const retryDelayFactor = 1000; // Base delay factor for retries

    try {
      const initialDelay = Math.floor(Math.random() * 3000); // Larger jitter to further stagger
      await new Promise(resolve => setTimeout(resolve, initialDelay));

      while (retries < maxRetries) {
        const lockKey = 'test-cron-job-lock';
        const lockTTL = 20 * 1000; // 20 seconds TTL for the cron job lock

        // Attempt to acquire lock
        let acquired = await redisClient.set(lockKey, 'locked', {
          NX: true,
          PX: lockTTL,
        });

        if (acquired) {
          console.log('Cron-1: Test cron job running on this server at:', new Date());
          await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate work for 3 seconds
          break; // Job executed, exit retry loop
        } else {
          console.log('Cron-1: Another server is running the cron job, skipping retries.');
          break; // No need to retry if another server has acquired the lock
        }
      }

      // Log if the max retries are exhausted without executing the job
      if (retries >= maxRetries) {
        console.error('Cron-1: Max retries reached, job not executed.');
      }

    } catch (err) {
      console.error('Error running test cron job:', err.message);
    }
  });

  console.log('Next run:', job.nextRun());

}).catch(console.error);
