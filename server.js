require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API route mapping (mimics Vercel local environment)
app.use(async (req, res, next) => {
  try {
    if (req.url.startsWith('/api/faculty')) {
      const handler = require('./api/faculty.js');
      return await handler(req, res);
    }
    
    if (req.url.startsWith('/api/sections')) {
      const handler = require('./api/timetable.js');
      return await handler(req, res);
    }
    
    // If not an API route, continue to static files
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve frontend static files from the root
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Local Dev Server running at http://localhost:${port}`);
  console.log(`(This Express server replaces the Vercel CLI login requirement)`);
  console.log(`======================================================\n`);
});
