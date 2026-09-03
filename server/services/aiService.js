import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Fast Flash-class Gemini models in speed-optimized priority order
const FAST_GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.6-flash'
];

// Simple in-memory cache for non-personalized, single-turn general queries
const queryCache = new Map();
const CACHE_MAX_SIZE = 50;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCachedResponse(query) {
  const normalized = query.trim().toLowerCase();
  const entry = queryCache.get(normalized);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    queryCache.delete(normalized);
    return null;
  }
  return entry.response;
}

function setCachedResponse(query, response) {
  const normalized = query.trim().toLowerCase();
  if (queryCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = queryCache.keys().next().value;
    queryCache.delete(oldestKey);
  }
  queryCache.set(normalized, {
    response,
    timestamp: Date.now()
  });
}

/**
 * Compact, high-efficiency system prompt.
 * Fast to process, covers all required capabilities without bloated token size.
 */
function buildCompactSystemPrompt(profile) {
  let profileSnippet = '';

  if (profile && (profile.name || profile.degree || profile.skills || profile.goal)) {
    const skills = profile.skills
      ? Object.entries(profile.skills)
          .slice(0, 8)
          .map(([k, v]) => `${k}:${v}`)
          .join(', ')
      : '';

    profileSnippet = `\nSTUDENT CONTEXT: ${profile.name || 'Student'}, ${profile.degree || ''} ${profile.branch || ''} (${profile.year || ''}). Goal: ${profile.goal || 'Software Dev'}. Skills: ${skills || 'Beginner'}.`;
  }

  return `You are FutureAlign AI Career Coach, an intelligent, fast, knowledgeable, and practical tech mentor.
CAPABILITIES:
- Answer general questions accurately, helpfully, and concisely (e.g. "What is machine learning?", "What is the capital of Japan?").
- Programming: Write clean, idiomatic code (Java, Python, JS, C++, etc.) with explanations and time/space complexity when applicable.
- Technical comparisons (e.g. React vs Angular): give pros, cons, and recommendations.
- Career guidance, roadmaps, project ideas, DSA strategies, and interview prep.
- Memory & Follow-ups: maintain conversational context across turns (e.g. "Give me a simple example", "Explain in Hinglish").
GUIDELINES:
- Be concise, direct, and structured. Use Markdown (bold text, lists, code blocks).
- For simple questions, give crisp, clear answers without unnecessary filler.${profileSnippet}`;
}

/**
 * Normalizes message history into a sliding window of recent messages for Gemini.
 * Keeps at most `maxMessages` (default 10) to minimize latency and token overhead.
 */
function prepareGeminiChatHistory(messages, maxMessages = 10) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages list cannot be empty.');
  }

  // Filter out system errors or empty messages
  const clean = messages.filter((m) => {
    if (!m || typeof m.content !== 'string') return false;
    const trimmed = m.content.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('⚠️') && trimmed.includes('trouble communicating')) return false;
    return true;
  });

  if (clean.length === 0) {
    throw new Error('No valid messages to send.');
  }

  // Use sliding window: keep the latest `maxMessages`
  const windowed = clean.slice(-maxMessages);
  const latestMessage = windowed[windowed.length - 1].content.trim();
  const rawHistory = windowed.slice(0, windowed.length - 1);
  const normalizedHistory = [];

  for (const msg of rawHistory) {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    const text = msg.content.trim();

    if (normalizedHistory.length === 0) {
      if (role === 'user') {
        normalizedHistory.push({ role, parts: [{ text }] });
      }
    } else {
      const prev = normalizedHistory[normalizedHistory.length - 1];
      if (prev.role === role) {
        prev.parts[0].text += `\n\n${text}`;
      } else {
        normalizedHistory.push({ role, parts: [{ text }] });
      }
    }
  }

  if (normalizedHistory.length > 0 && normalizedHistory[normalizedHistory.length - 1].role === 'user') {
    normalizedHistory.pop();
  }

  return {
    history: normalizedHistory,
    latestMessage
  };
}

/**
 * Main chat handler: sends multi-turn chat to Gemini.
 */
export async function getAIChatResponse({ messages, profile, timing = {} }) {
  // Clean keys (trim whitespace and strip any accidental surrounding quotes)
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  const openaiKey = (process.env.OPENAI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  const anthropicKey = (process.env.ANTHROPIC_API_KEY || '').trim().replace(/^["']|["']$/g, '');

  if (!geminiKey && !openaiKey && !anthropicKey) {
    const err = new Error('AI_API_KEY_MISSING');
    err.code = 'NO_API_KEYS_CONFIGURED';
    throw err;
  }

  const latestMsg = messages[messages.length - 1]?.content?.trim() || '';

  // Check in-memory cache for simple single-turn non-personalized queries
  const isSimpleSingleQuery = messages.length === 1 && (!profile || (!profile.name && !profile.skills));
  if (isSimpleSingleQuery) {
    const cached = getCachedResponse(latestMsg);
    if (cached) {
      timing.cacheHit = true;
      return cached;
    }
  }

  const tPrep0 = Date.now();
  const systemPrompt = buildCompactSystemPrompt(profile);
  const { history, latestMessage } = prepareGeminiChatHistory(messages, 10);
  timing.contextPrepMs = Date.now() - tPrep0;

  if (geminiKey) {
    const response = await callFastGeminiChat({
      systemPrompt,
      history,
      latestMessage,
      apiKey: geminiKey,
      timing
    });

    // Cache if it was a simple single-turn query
    if (isSimpleSingleQuery && response) {
      setCachedResponse(latestMsg, response);
    }

    return response;
  } else if (openaiKey) {
    return callOpenAIChat(systemPrompt, messages, openaiKey);
  } else {
    return callAnthropicChat(systemPrompt, messages, anthropicKey);
  }
}

/**
 * Fast Gemini chat execution with automatic model escalation
 */
async function callFastGeminiChat({ systemPrompt, history, latestMessage, apiKey, timing }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of FAST_GEMINI_MODELS) {
    const tStart = Date.now();
    try {
      timing.modelUsed = modelName;
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt
      });

      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.6
        }
      });

      const result = await chat.sendMessage(latestMessage);
      const response = await result.response;
      const text = response.text();
      timing.geminiMs = Date.now() - tStart;

      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err) {
      const duration = Date.now() - tStart;
      console.warn(`[Gemini SDK] Model '${modelName}' failed (${duration}ms):`, err.message || err);
      lastError = err;

      // Escalate to next model if model not found (404) or high demand / overloaded (503)
      if (
        err.status === 404 ||
        err.status === 503 ||
        (err.message && (err.message.includes('not found') || err.message.includes('high demand') || err.message.includes('overloaded')))
      ) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All configured fast Gemini models failed.');
}

/**
 * Fallback OpenAI completion
 */
async function callOpenAIChat(systemPrompt, messages, apiKey) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const apiMessages = [{ role: 'system', content: systemPrompt }];

  messages.slice(-8).forEach((msg) => {
    if (msg.content && !msg.content.startsWith('⚠️')) {
      apiMessages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    }
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      max_tokens: 1024,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API failed with status ${response.status}`);
  }

  const result = await response.json();
  return (result.choices?.[0]?.message?.content || '').trim();
}

/**
 * Fallback Anthropic completion
 */
async function callAnthropicChat(systemPrompt, messages, apiKey) {
  const url = 'https://api.anthropic.com/v1/messages';
  const apiMessages = [];

  messages.slice(-8).forEach((msg) => {
    if (msg.content && !msg.content.startsWith('⚠️')) {
      apiMessages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    }
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: systemPrompt,
      messages: apiMessages
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API failed with status ${response.status}`);
  }

  const result = await response.json();
  return (result.content?.[0]?.text || '').trim();
}

/**
 * Fast Career Results enrichment with Gemini
 */
export async function getAICareerEnrichment({ profile, topMatchName, matchPercentage, description }) {
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  if (!geminiKey) throw new Error('NO_API_KEYS_CONFIGURED');

  const prompt = `Senior Career Coach. Respond ONLY with a raw JSON object with 3 keys:
"advice": Why ${topMatchName} (${matchPercentage}% match) fits student (${profile.degree || ''} ${profile.branch || ''}, skills: ${JSON.stringify(profile.skills || {})}).
"strategy": Learning plan for missing skills.
"comparison": Brief comparison to other career paths.`;

  const genAI = new GoogleGenerativeAI(geminiKey);
  for (const modelName of FAST_GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 800
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text() || '';
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (err) {
      if (err.status === 404 || err.status === 503) continue;
      throw err;
    }
  }

  throw new Error('Failed to enrich career advice.');
}
