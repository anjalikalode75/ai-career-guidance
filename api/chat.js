import { getAIChatResponse } from '../server/services/aiService.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ success: false, error: `Method ${req.method} Not Allowed. Expected POST.` });
  }

  // Parse body if string (Vercel parses JSON, but guard against unparsed body)
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      res.statusCode = 400;
      return res.json({ success: false, error: 'Invalid JSON body' });
    }
  }

  const { messages, profile } = body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.statusCode = 400;
    return res.json({ success: false, error: 'Messages list is required and must be a non-empty array' });
  }

  const timing = {};
  const lastUserMsg = messages[messages.length - 1]?.content?.substring(0, 60) || '';
  console.log(`[Vercel Serverless /api/chat] Received: "${lastUserMsg}"`);

  try {
    const reply = await getAIChatResponse({ messages, profile, timing });

    res.statusCode = 200;
    return res.json({
      success: true,
      fallback: false,
      message: {
        role: 'assistant',
        content: reply
      }
    });
  } catch (error) {
    console.error(`[Vercel Serverless /api/chat] Error:`, error.message || error);

    const isMissingKey = error.code === 'NO_API_KEYS_CONFIGURED' || error.message === 'AI_API_KEY_MISSING';
    const isQuotaExceeded = error.status === 429 || (error.message && error.message.includes('Resource has been exhausted'));

    let userMessage = 'The AI assistant is temporarily unavailable. Please try again shortly.';
    let errorCode = 'AI_SERVICE_ERROR';

    if (isMissingKey) {
      userMessage = 'GEMINI_API_KEY is not configured on Vercel. Please add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.';
      errorCode = 'MISSING_API_KEY';
    } else if (isQuotaExceeded) {
      userMessage = 'Gemini API quota has been reached. Please wait a moment and retry.';
      errorCode = 'QUOTA_EXCEEDED';
    } else if (error.message) {
      userMessage = `AI Assistant Error: ${error.message}`;
    }

    res.statusCode = 503;
    return res.json({
      success: false,
      error: userMessage,
      code: errorCode
    });
  }
}
