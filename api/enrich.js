import { getAICareerEnrichment } from '../server/services/aiService.js';
import { CAREERS_DATA } from '../src/data/careersData.js';
import { calculateCareerMatches } from '../src/utils/scoringEngine.js';

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

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      res.statusCode = 400;
      return res.json({ success: false, error: 'Invalid JSON body' });
    }
  }

  const { profile } = body || {};

  if (!profile) {
    res.statusCode = 400;
    return res.json({ success: false, error: 'Profile is required' });
  }

  const matches = calculateCareerMatches(profile, CAREERS_DATA);
  if (!matches || matches.length === 0) {
    res.statusCode = 400;
    return res.json({ success: false, error: 'Failed to calculate matches' });
  }

  const topMatch = matches[0];

  try {
    const enriched = await getAICareerEnrichment({
      profile,
      topMatchName: topMatch.name,
      matchPercentage: topMatch.matchPercentage,
      description: topMatch.description
    });

    res.statusCode = 200;
    return res.json({
      success: true,
      fallback: false,
      advice: enriched.advice,
      strategy: enriched.strategy,
      comparison: enriched.comparison
    });
  } catch (error) {
    console.warn(`[Vercel Serverless /api/enrich] Fallback notice:`, error.message);

    res.statusCode = 200;
    return res.json({
      success: true,
      fallback: true,
      advice: topMatch.whySuitabilityExplanation,
      strategy: `Prioritize learning missing technologies: ${(topMatch.requiredSkills || []).filter(s => (profile.skills?.[s] === undefined)).join(', ')}. Focus on building hands-on projects to solidify these.`,
      comparison: `A career as a ${topMatch.name} offers strong growth. Compared to other paths, it aligns directly with your strengths in ${Array.isArray(profile.strengths) ? profile.strengths.join(', ') : 'problem solving'}.`
    });
  }
}
