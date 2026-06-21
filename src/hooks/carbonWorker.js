// Web Worker for Carbon Footprint calculations (Self-contained)

const factors = {
  emails: 4.0,
  aiPrompts: 4.5,
  streaming: 36.0,
  meetings: 157.0, 
  storage: 0.016, 
  social: 72.0,
};

self.onmessage = function (e) {
  const { traces } = e.data;
  if (!traces) return;

  const emailDaily = (traces.emails || 0) * factors.emails;
  const aiDaily = (traces.aiPrompts || 0) * factors.aiPrompts;
  const streamingDaily = (traces.streaming || 0) * factors.streaming;
  const meetingsDaily = ((traces.meetings || 0) * factors.meetings) / 7;
  const storageDaily = (traces.storage || 0) * factors.storage;
  const socialDaily = (traces.social || 0) * factors.social;

  const totalDaily = emailDaily + aiDaily + streamingDaily + meetingsDaily + storageDaily + socialDaily;
  const totalAnnualKg = (totalDaily * 365) / 1000;

  self.postMessage({
    breakdown: {
      emails: parseFloat(emailDaily.toFixed(2)),
      aiPrompts: parseFloat(aiDaily.toFixed(2)),
      streaming: parseFloat(streamingDaily.toFixed(2)),
      meetings: parseFloat(meetingsDaily.toFixed(2)),
      storage: parseFloat(storageDaily.toFixed(2)),
      social: parseFloat(socialDaily.toFixed(2)),
    },
    totalDailyGrams: parseFloat(totalDaily.toFixed(2)),
    totalAnnualKg: parseFloat(totalAnnualKg.toFixed(2)),
    carMiles: parseFloat((totalAnnualKg * 2.5).toFixed(2)),            // kept for legacy consumers if any
    ceilingFanDays: Math.round((totalAnnualKg * 1000) / (50 * 0.82 / 1000) / 24 / 1000), // 50W fan, India grid 0.82 kgCO2/kWh
    smartphoneCharges: Math.round(totalAnnualKg * 1000 / (12 * 0.82 / 1000) / 1000),     // 12Wh/charge, India grid
    treesRequired: parseFloat((totalAnnualKg / 22.0).toFixed(2)),
  });
};
