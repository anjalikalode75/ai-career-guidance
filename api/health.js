export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  res.statusCode = 200;
  return res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'production',
    hasGeminiKey: !!(process.env.GEMINI_API_KEY || '').trim(),
    time: new Date()
  });
}
