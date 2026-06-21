// Daily/Weekly digital carbon factors (in grams of CO2e)
export const carbonFactors = {
  emails: {
    label: "Emails Sent/Received",
    factor: 4.0, // 4g per email (average including attachments/threads)
    unit: "emails/day",
    max: 200,
  },
  aiPrompts: {
    label: "AI Queries / Prompts",
    factor: 4.5, // 4.5g per AI request (highly energy-intensive GPU inference)
    unit: "prompts/day",
    max: 100,
  },
  streaming: {
    label: "HD Video Streaming",
    factor: 36.0, // 36g per hour of HD streaming
    unit: "hours/day",
    max: 12,
  },
  meetings: {
    label: "Video Meetings",
    factor: 157.0, // 157g per hour of active video calls
    unit: "hours/week",
    max: 40,
  },
  storage: {
    label: "Cloud Storage",
    factor: 0.016, // 0.016g per GB per day (~0.5g per GB/month)
    unit: "GB",
    max: 200,
  },
  social: {
    label: "Social Media Scroll",
    factor: 72.0, // 72g per hour (~1.2g per minute)
    unit: "hours/day",
    max: 8,
  }
};

/**
 * Calculates the daily carbon footprint in grams of CO2e.
 * @param {Object} traces User trace numbers
 */
export function calculateDailyFootprint(traces) {
  const emailDaily = (traces.emails || 0) * carbonFactors.emails.factor;
  const aiDaily = (traces.aiPrompts || 0) * carbonFactors.aiPrompts.factor;
  const streamingDaily = (traces.streaming || 0) * carbonFactors.streaming.factor;
  const meetingsDaily = ((traces.meetings || 0) * carbonFactors.meetings.factor) / 7; // Convert weekly to daily
  const storageDaily = (traces.storage || 0) * carbonFactors.storage.factor;
  const socialDaily = (traces.social || 0) * carbonFactors.social.factor;

  const totalDaily = emailDaily + aiDaily + streamingDaily + meetingsDaily + storageDaily + socialDaily;

  // Annual projection in kg
  const totalAnnualKg = (totalDaily * 365) / 1000;

  return {
    breakdown: {
      emails: emailDaily,
      aiPrompts: aiDaily,
      streaming: streamingDaily,
      meetings: meetingsDaily,
      storage: storageDaily,
      social: socialDaily,
    },
    totalDailyGrams: totalDaily,
    totalAnnualKg: totalAnnualKg,
    // Comparisons
    carMiles: totalAnnualKg * 2.5, // 1kg CO2e is approx 2.5 miles in an average car
    treesRequired: totalAnnualKg / 22.0, // An average mature tree absorbs ~22kg CO2 per year
  };
}

/**
 * Returns footprint reduction in grams of CO2e based on a reduction percentage (0-100)
 */
export function calculateReduction(currentDaily, reductionScore) {
  // Let's say max mindful practices can save up to 40% of standard digital emissions
  const maxSavingsRatio = 0.40;
  const dailySaved = currentDaily * maxSavingsRatio * (reductionScore / 100);
  const annualSavedKg = (dailySaved * 365) / 1000;
  return {
    dailySavedGrams: dailySaved,
    annualSavedKg: annualSavedKg,
  };
}
