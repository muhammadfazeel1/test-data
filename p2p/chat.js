const Hyperswarm = require('hyperswarm');
const crypto = require('crypto');
const readline = require('readline');

// Generate a topic (shared among all peers in the same chat)
const topic = crypto.createHash('sha256')
  .update('my-p2p-chat-room') // change this string to create different rooms
  .digest();

const swarm = new Hyperswarm();

// Join the network
swarm.join(topic, {
  lookup: true,   // find peers
  announce: true  // announce yourself
});

swarm.on('connection', (socket, details) => {
  console.log('New peer connected!');

  // Send message to peer when user types something
  rl.on('line', (input) => {
    socket.write(input);
  });

  // Read incoming messages
  socket.on('data', (data) => {
    console.log(`[Peer]: ${data.toString()}`);
  });
});

// Terminal input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔗 Waiting for peers...');
