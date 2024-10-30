import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../build')));

// API routes
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Server is running' });
});

// Catch-all route should serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;