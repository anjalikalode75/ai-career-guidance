import app from './app.js';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 5000;

// Resolve paths for local production static serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Serve static assets in local production preview mode
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(projectRoot, 'dist');
  app.use(express.static(distPath));
  
  app.get('/*splat', (req, res, next) => {
    if (req.url.startsWith('/api/') || req.url.startsWith('/chat') || req.url.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start standalone server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
