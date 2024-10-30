import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { addUrls, getReports, runLighthouseScan, testDatabaseConnection } from './services/urlService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API routes
app.get('/api/reports', async (req, res) => {
  console.log('GET /api/reports - Starting request');
  try {
    console.log('Attempting to fetch reports from database...');
    const reports = await getReports();
    console.log('Reports fetched successfully:', reports);
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/urls', async (req, res) => {
  console.log('POST /api/urls - Starting request', req.body);
  try {
    console.log('Attempting to add URLs to database...');
    const result = await addUrls(req.body);
    console.log('URLs added successfully:', result);
    res.json(result);
  } catch (error) {
    console.error('Error adding URLs:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scan', async (req, res) => {
  try {
    const { url, device } = req.body;
    const result = await runLighthouseScan(url, device);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a test endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const isConnected = await testDatabaseConnection();
        res.json({
            connected: isConnected,
            supabaseUrl: process.env.SUPABASE_URL ? 'Configured' : 'Missing',
            supabaseKey: process.env.SUPABASE_KEY ? 'Configured' : 'Missing'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all route should serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

export default app;