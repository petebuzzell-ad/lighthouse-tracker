const app = require('./server.js');

module.exports = (req, res) => {
  console.log('Request received:', req.method, req.url);
  app(req, res);
};
