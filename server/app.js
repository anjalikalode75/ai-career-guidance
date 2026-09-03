import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAIChatResponse, getAICareerEnrichment } from './services/aiService.js';
import { CAREERS_DATA } from '../src/data/careersData.js';
import { calculateCareerMatches } from '../src/utils/scoringEngine.js';

// Setup environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Normalize URL for Vercel serverless rewrites
app.use((req, res, next) => {
  // If serverless rewrite stripped the subpath (e.g. req.url is '/' but originalUrl has path)
  if ((req.url === '/' || req.url === '/api') && req.originalUrl && req.originalUrl !== '/' && req.originalUrl !== '/api') {
    req.url = req.originalUrl;
  }
  next();
});

// Router supporting both prefixed (/api/...) and non-prefixed (/...) paths for Vercel compatibility
const apiRouter = express.Router();

// Health check handler
const handleHealth = (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    hasGeminiKey: !!(process.env.GEMINI_API_KEY || '').trim(),
    time: new Date()
  });
};

apiRouter.get('/health', handleHealth);
apiRouter.get('/', (req, res) => {
  return handleHealth(req, res);
});

// 1. AI Enrichment handler for Results Page
const handleEnrich = async (req, res) => {
  const { profile } = req.body;
  
  if (!profile) {
    return res.status(400).json({ success: false, error: 'Profile is required' });
  }

  const matches = calculateCareerMatches(profile, CAREERS_DATA);
  if (!matches || matches.length === 0) {
    return res.status(400).json({ success: false, error: 'Failed to calculate matches' });
  }

  const topMatch = matches[0];

  try {
    const enriched = await getAICareerEnrichment({
      profile,
      topMatchName: topMatch.name,
      matchPercentage: topMatch.matchPercentage,
      description: topMatch.description
    });

    return res.json({
      success: true,
      fallback: false,
      advice: enriched.advice,
      strategy: enriched.strategy,
      comparison: enriched.comparison
    });

  } catch (error) {
    console.warn(`[AI Fallback] Failed to enrich via AI: ${error.message}. Returning local recommendation.`);
    
    return res.json({
      success: true,
      fallback: true,
      advice: topMatch.whySuitabilityExplanation,
      strategy: `Prioritize learning missing technologies: ${(topMatch.requiredSkills || []).filter(s => (profile.skills?.[s] === undefined)).join(', ')}. Focus on building hands-on projects to solidify these.`,
      comparison: `A career as a ${topMatch.name} offers strong growth. Compared to other paths, it aligns directly with your strengths in ${Array.isArray(profile.strengths) ? profile.strengths.join(', ') : 'problem solving'}.`
    });
  }
};

apiRouter.post('/recommend/enrich', handleEnrich);

// 2. AI Chatbot Coach Handler (Fast, reliable JSON)
const handleChat = async (req, res) => {
  const t0 = Date.now();
  const { messages, profile } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, error: 'Messages list is required and must be a non-empty array' });
  }

  const timing = {};
  const lastUserMsg = messages[messages.length - 1]?.content?.substring(0, 60) || '';
  console.log(`[CHAT] Request received: "${lastUserMsg}" (context: ${messages.length} msgs)`);

  try {
    const reply = await getAIChatResponse({ messages, profile, timing });
    const totalMs = Date.now() - t0;

    console.log(`[CHAT] Total: ${totalMs} ms (model: ${timing.modelUsed || 'cache'})`);

    return res.json({
      success: true,
      fallback: false,
      message: {
        role: 'assistant',
        content: reply
      }
    });

  } catch (error) {
    console.error(`[AI Error] Chat API failed:`, error.message || error);

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

    return res.status(503).json({
      success: false,
      error: userMessage,
      code: errorCode
    });
  }
};

apiRouter.post('/chat', handleChat);

// Fallback: If POST body contains messages, treat as chat regardless of rewritten URL path
apiRouter.post('/', (req, res, next) => {
  if (req.body && Array.isArray(req.body.messages)) {
    return handleChat(req, res);
  }
  next();
});

// Mount router on BOTH '/api' AND '/' to guarantee compatibility with any serverless proxy rewrite
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
