const express = require('express');
const path = require('path');
const app = express();

// Error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this near the top of your routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running' });
  });

// Your existing API routes
app.use('/api', (req, res, next) => {
  console.log('API request:', req.method, req.url);
  next();
}, require('./routes/api'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

// For Vercel
module.exports = app;