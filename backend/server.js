const express = require('express');
const app = express();

// Basic route for testing
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Server is running' });
});

// Catch-all route
app.get('*', (req, res) => {
  console.log('Catch-all route accessed');
  res.send('Hello from the server!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;