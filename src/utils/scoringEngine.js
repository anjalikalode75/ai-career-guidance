export function calculateCareerMatches(profile, careersData) {
  if (!profile || !careersData) return [];

  const studentSkills = profile.skills || {};
  const studentInterests = profile.interests || [];
  const studentStrengths = profile.strengths || [];
  const studentGoalText = (profile.goal || '').toLowerCase();
  const studentDegree = profile.degree || '';
  const studentBranch = profile.branch || '';
  const studentExperience = profile.experience || 'Beginner';

  const matches = careersData.map((career) => {
    // 1. Skills Match Score (40%)
    let skillsScore = 0;
    const reqSkills = career.requiredSkills || [];
    const recSkills = career.recommendedSkills || [];

    // Required Skills Matching
    let reqSkillsScore = 0;
    if (reqSkills.length > 0) {
      let userReqTotal = 0;
      reqSkills.forEach((skill) => {
        if (studentSkills[skill] !== undefined) {
          userReqTotal += studentSkills[skill]; // rating 1 to 5
        }
      });
      const maxReqTotal = reqSkills.length * 5;
      reqSkillsScore = (userReqTotal / maxReqTotal) * 100;
    } else {
      reqSkillsScore = 100;
    }

    // Recommended Skills Matching
    let recSkillsScore = 0;
    if (recSkills.length > 0) {
      let userRecTotal = 0;
      recSkills.forEach((skill) => {
        if (studentSkills[skill] !== undefined) {
          userRecTotal += studentSkills[skill]; // rating 1 to 5
        }
      });
      const maxRecTotal = recSkills.length * 5;
      recSkillsScore = (userRecTotal / maxRecTotal) * 100;
    } else {
      recSkillsScore = 100;
    }

    // Weight required skills heavier than recommended
    skillsScore = (reqSkillsScore * 0.85) + (recSkillsScore * 0.15);

    // 2. Interests Match Score (25%)
    let interestsScore = 0;
    const careerInterests = career.interests || [];
    if (careerInterests.length > 0) {
      const matched = careerInterests.filter(i => studentInterests.includes(i)).length;
      interestsScore = (matched / careerInterests.length) * 100;
    } else {
      interestsScore = 100;
    }

    // 3. Strengths Match Score (15%)
    let strengthsScore = 0;
    const careerStrengths = career.strengths || [];
    if (careerStrengths.length > 0) {
      const matched = careerStrengths.filter(s => studentStrengths.includes(s)).length;
      strengthsScore = (matched / careerStrengths.length) * 100;
    } else {
      strengthsScore = 100;
    }

    // 4. Education Match Score (10%)
    const degreeMatch = career.degrees.includes(studentDegree) ? 100 : 50;
    let branchMatch = 30;
    if (career.branches.includes(studentBranch)) {
      branchMatch = 100;
    } else if (career.branches.includes('Other')) {
      branchMatch = 70;
    }
    const educationScore = (degreeMatch * 0.4) + (branchMatch * 0.6);

    // 5. Goal Match Score (10%)
    // Experience vs Difficulty
    let diffScore = 50;
    const diff = career.difficulty; // Beginner, Intermediate, Advanced
    if (studentExperience === 'Advanced') {
      diffScore = 100;
    } else if (studentExperience === 'Intermediate') {
      diffScore = diff === 'Advanced' ? 80 : 100;
    } else { // Beginner student
      if (diff === 'Beginner') diffScore = 100;
      else if (diff === 'Intermediate') diffScore = 80;
      else diffScore = 50;
    }

    // Keyword analysis on target goal
    let goalKeywordScore = 50;
    const keywordsMap = {
      'software-developer': ['software', 'develop', 'program', 'java', 'c++', 'backend'],
      'full-stack-developer': ['full', 'stack', 'web', 'react', 'node', 'frontend', 'backend', 'js', 'javascript'],
      'data-analyst': ['analyst', 'analytics', 'tableau', 'excel', 'powerbi', 'reporting'],
      'data-scientist': ['scientist', 'predictive', 'data science', 'math', 'statistics'],
      'ai-ml-engineer': ['ai', 'ml', 'machine', 'learning', 'neural', 'deep', 'pytorch', 'tensorflow', 'model'],
      'cybersecurity-analyst': ['cyber', 'security', 'pentest', 'ethical', 'hack', 'network'],
      'cloud-engineer': ['cloud', 'aws', 'azure', 'serverless', 'infrastructure'],
      'devops-engineer': ['devops', 'cicd', 'pipeline', 'docker', 'kubernetes', 'ansible'],
      'ui-ux-designer': ['ui', 'ux', 'design', 'figma', 'prototype', 'creative', 'visual'],
      'mobile-app-developer': ['mobile', 'app', 'android', 'ios', 'react native', 'flutter', 'kotlin', 'swift']
    };

    const careerKeywords = keywordsMap[career.id] || [];
    const matchedKeyword = careerKeywords.some((kw) => studentGoalText.includes(kw));
    if (matchedKeyword) {
      goalKeywordScore = 100;
    }

    const goalScore = (diffScore * 0.5) + (goalKeywordScore * 0.5);

    // Calculate weighted total score
    const weightedTotal = 
      (skillsScore * 0.40) + 
      (interestsScore * 0.25) + 
      (strengthsScore * 0.15) + 
      (educationScore * 0.10) + 
      (goalScore * 0.10);

    const matchPercentage = Math.round(weightedTotal);

    // Generate local template-based suitability explanation
    const matchedStrengthsList = careerStrengths.filter(s => studentStrengths.includes(s));
    const matchedInterestsList = careerInterests.filter(i => studentInterests.includes(i));
    const missingSkillsList = reqSkills.filter(s => studentSkills[s] === undefined);

    let explanation = `Your profile shows a match score of ${matchPercentage}% for this role. `;
    if (matchedInterestsList.length > 0) {
      explanation += `Your interest in ${matchedInterestsList.join(' and ')} aligns directly with the day-to-day work. `;
    }
    if (matchedStrengthsList.length > 0) {
      explanation += `Your strengths in ${matchedStrengthsList.join(', ')} provide a strong foundation for success. `;
    }
    if (missingSkillsList.length > 0) {
      explanation += `To boost your compatibility, we suggest focusing on key missing skills: ${missingSkillsList.join(', ')}.`;
    } else {
      explanation += `You possess all core required skills, making you an excellent candidate for this career path!`;
    }

    return {
      careerId: career.id,
      name: career.name,
      matchPercentage,
      description: career.description,
      difficulty: career.difficulty,
      estLearningTime: career.estLearningTime,
      typicalRoles: career.typicalRoles,
      requiredSkills: career.requiredSkills,
      recommendedSkills: career.recommendedSkills,
      breakdown: {
        skills: Math.round(skillsScore),
        interests: Math.round(interestsScore),
        strengths: Math.round(strengthsScore),
        education: Math.round(educationScore),
        goals: Math.round(goalScore)
      },
      whySuitabilityExplanation: explanation
    };
  });

  // Sort matches by percentage descending
  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
