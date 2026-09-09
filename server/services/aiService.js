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
 * Checks if text contains explicit personal signals referencing the user's profile, skills, or status.
 */
function hasExplicitPersonalSignal(text) {
  const lower = (text || '').toLowerCase().trim();

  return (
    /\b(my profile|my account|my details|my resume|my assessment)\b/i.test(lower) ||
    /\b(based on my|according to my|analyze my|check my)\b/i.test(lower) ||
    /\b(my skills|my current skills|my knowledge|my strengths)\b/i.test(lower) ||
    /\b(for me|suits? me|suited for me|fit for me|fits me|recommend for me|suggest for me|best for me)\b/i.test(lower) ||
    /\b(after my b\.?tech|after my degree|after my graduation|for my placement|for my interview)\b/i.test(lower) ||
    /\b(what should i learn for my career)\b/i.test(lower)
  );
}

/**
 * Checks if text is an educational transition question (like after 12th, 10th).
 */
function isSchoolOrGeneralEducation(text) {
  const lower = (text || '').toLowerCase().trim();

  return (
    /\b(after 12th|after 12|after 10th|after 10|in 12th|in 10th|12th (pass|standard|commerce|science|arts|pcm|pcb|stream))\b/i.test(lower) ||
    /\b(12th ke baad|10th ke baad|after intermediate|after plus two|after \+2)\b/i.test(lower)
  );
}

/**
 * Checks if text is a general conceptual, technical, or broad course question.
 */
function isGeneralConceptOrTechnical(text) {
  const lower = (text || '').toLowerCase().trim();

  return (
    /^what (is|are|was|were)\b/i.test(lower) ||
    /^(explain|describe|define|how does|how to|write|code for|compare|difference between)\b/i.test(lower) ||
    /\b(what is bca|what is btech|what is bba|what is mba|what is mbbs|what is b\.?sc)\b/i.test(lower) ||
    /\b(which programming language is best for beginners|best language for beginner|how to start coding|roadmap for web development)\b/i.test(lower)
  );
}

/**
 * Checks if text is an ambiguous open-ended career query (e.g. "Which career should I choose?").
 */
function isAmbiguousCareerQuery(text) {
  const lower = (text || '').toLowerCase().trim();

  return (
    /\b(which career|what career|suggest a career|choose a career|pick a career|career advice|career suggestion)\b/i.test(lower) &&
    !hasExplicitPersonalSignal(lower) &&
    !isSchoolOrGeneralEducation(lower) &&
    !isGeneralConceptOrTechnical(lower)
  );
}

/**
 * Detects whether the query intent is 'PERSONALIZED', 'GENERAL', or 'AMBIGUOUS'.
 */
export function detectQueryIntent(latestMessage = '', messages = [], profile = null) {
  const text = (latestMessage || '').trim();

  // 1. Explicit personal signal always takes precedence
  if (hasExplicitPersonalSignal(text)) {
    return 'PERSONALIZED';
  }

  // 2. School/12th/10th or general educational questions are strictly GENERAL
  if (isSchoolOrGeneralEducation(text)) {
    return 'GENERAL';
  }

  // 3. Technical concepts, definitions, programming questions are strictly GENERAL
  if (isGeneralConceptOrTechnical(text)) {
    return 'GENERAL';
  }

  // 4. Ambiguous broad career questions (e.g. "Which career should I choose?")
  if (isAmbiguousCareerQuery(text)) {
    return 'AMBIGUOUS';
  }

  // 5. Check if previous conversation turns established an active personalized context
  if (messages && messages.length >= 3) {
    const prevUserMsg = messages[messages.length - 3]?.content || '';
    if (hasExplicitPersonalSignal(prevUserMsg) && !isSchoolOrGeneralEducation(text) && !isGeneralConceptOrTechnical(text)) {
      return 'PERSONALIZED';
    }
  }

  return 'GENERAL';
}

/**
 * Compact, intent-aware system prompt.
 * Treats user profile as contextual background, never misapplying it to general queries.
 */
function buildCompactSystemPrompt(profile, queryIntent = 'GENERAL') {
  let profileSection = '';

  if (profile && (profile.name || profile.degree || profile.skills || profile.goal)) {
    const skills = profile.skills
      ? Object.entries(profile.skills)
          .slice(0, 8)
          .map(([k, v]) => `${k}:${v}`)
          .join(', ')
      : '';

    if (queryIntent === 'PERSONALIZED') {
      profileSection = `
STUDENT PROFILE (ACTIVE FOR THIS QUESTION):
- Name: ${profile.name || 'Student'}
- Degree & Stream: ${profile.degree || ''} in ${profile.branch || ''} (${profile.year || ''})
- Target Goal: ${profile.goal || 'Software Engineer'}
- Evaluated Skills: ${skills || 'Beginner'}
- Strengths: ${Array.isArray(profile.strengths) ? profile.strengths.join(', ') : 'Problem Solving'}
INSTRUCTION: The user explicitly requested personalized guidance. Tailor your answer specifically to their degree, year, skills, and goals.`;
    } else if (queryIntent === 'AMBIGUOUS') {
      profileSection = `
SAVED STUDENT PROFILE (DO NOT ASSUME OR FORCE):
- Stored Background: ${profile.degree || ''} ${profile.branch || ''} (${profile.year || ''})
INSTRUCTION: The user's question is broad and ambiguous (e.g. "Which career should I choose?").
1. DO NOT assume they are currently pursuing ${profile.degree || 'any specific degree'}.
2. Provide a helpful high-level breakdown across major streams (Engineering/Tech, Management/Commerce, Design, etc.).
3. Ask a brief, friendly clarification question asking for their 12th stream/degree, interests, or if they would like you to analyze their saved profile (${profile.degree || ''} in ${profile.branch || ''}).`;
    } else {
      // GENERAL mode
      profileSection = `
INSTRUCTION: The user is asking a GENERAL or EDUCATIONAL question.
1. Answer GENERALLY, objectively, and comprehensively.
2. DO NOT mention or assume the user's personal profile (degree, branch, year, or skills).
3. If the user asks about 12th standard (e.g. "After 12th what career should I choose?"), outline the options across Science (PCM/PCB), Commerce, and Arts. DO NOT assume the user is already in college or studying B.Tech.
4. For technical concepts (e.g. "What is Java?", "Explain inheritance in Java", "What is BCA?"), provide a direct, clear explanation without personal references.`;
    }
  }

  return `You are FutureAlign AI Career Coach, a professional, knowledgeable, practical, and helpful mentor for technology and career guidance.
CAPABILITIES:
- Educational Transitions: Provide objective overviews of options after 10th, 12th, or graduation across all streams (Science/PCM/PCB, Commerce, Arts).
- Technical & Programming: Write clean, idiomatic code with explanations and time/space complexity (Java, Python, JS, C++, SQL, DSA, DBMS).
- Tech Comparisons: Impartial pros/cons and career relevance.
- Career Guidance & Roadmaps: Clear learning pathways, project suggestions, and interview preparation.
- Multi-turn Memory: Follow up naturally on context across turns.

CRITICAL RULES:
1. PROFILE INDEPENDENCE: The student profile is contextual background data, NOT the subject of every question. Use it ONLY when the user explicitly asks for personal guidance (e.g. "based on my profile", "my skills", "for me").
2. NO FALSE ASSUMPTIONS: When the user asks general or 12th-grade questions, NEVER say "Since you are in 3rd year B.Tech...", "As a computer science student...", or "Based on your profile...".
3. CONCISE & STRUCTURED: Use clean Markdown (bold text, bullet lists, code blocks). Answer directly without filler.${profileSection}`;
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

  const queryIntent = detectQueryIntent(latestMsg, messages, profile);
  timing.queryIntent = queryIntent;

  // Check in-memory cache for simple single-turn non-personalized queries
  const isSimpleSingleQuery = messages.length === 1 && queryIntent === 'GENERAL';
  if (isSimpleSingleQuery) {
    const cached = getCachedResponse(latestMsg);
    if (cached) {
      timing.cacheHit = true;
      return cached;
    }
  }

  const tPrep0 = Date.now();
  const systemPrompt = buildCompactSystemPrompt(profile, queryIntent);
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
