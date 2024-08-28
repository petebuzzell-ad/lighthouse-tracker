const express = require('express');
const path = require('path');
const { getReports, addUrls, runLighthouseScan } = require('./services/urlService');

const app = express();

// Error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// API routes
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await getReports();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

app.post('/api/urls', async (req, res) => {
  try {
    const { urls } = req.body;
    await addUrls(urls);
    res.json({ message: 'URLs added successfully' });
  } catch (error) {
    console.error('Error adding URLs:', error);
    res.status(500).json({ error: 'Failed to add URLs' });
  }
});

app.post('/api/scan', async (req, res) => {
  try {
    const { url, device } = req.body;
    await runLighthouseScan(url, device);
    res.json({ message: 'Scan initiated successfully' });
  } catch (error) {
    console.error('Error initiating scan:', error);
    res.status(500).json({ error: 'Failed to initiate scan' });
  }
});

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