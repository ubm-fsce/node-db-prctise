const { buffer, text, json } = require('micro');
module.exports = (req, res) => {
  res.end('Welcome to Micro');
};