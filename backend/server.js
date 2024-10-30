import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { addUrls, getReports, runLighthouseScan } from './services/urlService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API routes
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await getReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/urls', async (req, res) => {
  try {
    const result = await addUrls(req.body);
    res.json(result);
  } catch (error) {
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

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all route should serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

export default app;