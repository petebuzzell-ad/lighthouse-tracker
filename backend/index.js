import app from './server.js';

export default function handler(req, res) {
  console.log('Request received:', req.method, req.url);
  app(req, res);
}
