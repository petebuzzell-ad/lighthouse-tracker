import express from 'express';
import cron from 'node-cron';
import cors from 'cors';
import { runLighthouse } from './lighthouse/lighthouseRunner.js';
import { addUrls, getUrlsToTest, getReports } from './services/urlService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

app.post('/api/urls', async (req, res) => {
    console.log('Received POST request to /api/urls');
    console.log('Request body:', req.body);
    const { urls } = req.body;
    try {
        console.log('Calling addUrls with:', urls);
        const result = await addUrls(urls);
        console.log('Result from addUrls:', result);
        res.json({ message: 'URLs added successfully', data: result });
    } catch (error) {
        console.error('Error in /api/urls route:', error);
        res.status(500).json({ error: 'Failed to add URLs', details: error.message });
    }
});

app.get('/api/reports', async (req, res) => {
    try {
        const reports = await getReports();
        res.json(reports);
    } catch (error) {
        console.error('Error in /api/reports route:', error);
        res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
    }
});

// Schedule tasks to run every 4 hours
cron.schedule('0 */4 * * *', async () => {
    console.log('Running scheduled Lighthouse tests');
    try {
        const urlsToTest = await getUrlsToTest();
        console.log('URLs to test:', urlsToTest);
        for (const { url, device } of urlsToTest) {
            console.log(`Running Lighthouse for ${url} on ${device}`);
            await runLighthouse(url, device);
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

// New route for manual Lighthouse scan
app.post('/api/run-lighthouse', async (req, res) => {
    try {
        const { url, device } = req.body;
        if (!url || !device) {
            return res.status(400).json({ error: 'URL and device are required' });
        }
        console.log(`Initiating Lighthouse scan for ${url} on ${device}`);
        await runLighthouse(url, device);
        res.json({ message: `Lighthouse scan initiated for ${url} on ${device}` });
    } catch (error) {
        console.error('Error running manual Lighthouse scan:', error);
        res.status(500).json({ error: `Failed to run Lighthouse scan: ${error.message}` });
    }
});

// Serve static files from the 'public' directory
// app.use('/reports', express.static(path.join(__dirname, 'public', 'reports')));

// Log the reports directory path
// console.log('Reports directory:', path.join(__dirname, 'public', 'reports'));

export default app;