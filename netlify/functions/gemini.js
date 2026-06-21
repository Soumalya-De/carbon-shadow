const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function (event, context) {
  // Handle CORS preflight options request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY environment variable.");
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        error: "Server Configuration Error", 
        message: "Gemini API key is not configured on Netlify server." 
      }),
    };
  }

  try {
    const { traces } = JSON.parse(event.body);
    if (!traces) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Bad Request", message: "Missing traces object" }),
      };
    }

    const { emails, aiPrompts, streaming, meetings, storage, social } = traces;

    // Calculate footprint and identities for structured prompting
    const dailyGrams = 
      (emails || 0) * 4.0 + 
      (aiPrompts || 0) * 4.5 + 
      (streaming || 0) * 36.0 + 
      ((meetings || 0) / 7) * 157.0 + 
      (storage || 0) * 0.016 + 
      (social || 0) * 72.0;
    const annualKg = parseFloat(((dailyGrams * 365) / 1000).toFixed(2));

    const breakdown = {
      emails: (emails || 0) * 4.0,
      aiPrompts: (aiPrompts || 0) * 4.5,
      streaming: (streaming || 0) * 36.0,
      meetings: ((meetings || 0) / 7) * 157.0,
      storage: (storage || 0) * 0.016,
      social: (social || 0) * 72.0
    };

    let maxVal = -1;
    let primaryKey = "streaming";
    Object.keys(breakdown).forEach(key => {
      if (breakdown[key] > maxVal) {
        maxVal = breakdown[key];
        primaryKey = key;
      }
    });

    const contributorLabels = {
      emails: "Emails & Chat",
      aiPrompts: "AI Assistance",
      streaming: "Video Streaming",
      meetings: "Video Meetings",
      storage: "Cloud Archives",
      social: "Social Feed"
    };
    const primaryContributor = contributorLabels[primaryKey] || "Digital Habits";

    let digitalIdentity = "Digital Generalist";
    let improvementOpportunity = "Disable social media autoplay";

    if (annualKg < 30) {
      digitalIdentity = "Mindful Explorer";
      improvementOpportunity = "Disable photo cloud backups";
    } else if (annualKg < 100) {
      digitalIdentity = "Digital Generalist";
      improvementOpportunity = "Disable social media autoplay";
    } else {
      if (primaryKey === "aiPrompts") {
        digitalIdentity = "Curious Explorer";
        improvementOpportunity = "Save common prompt answers locally";
      } else if (primaryKey === "meetings" || primaryKey === "storage") {
        digitalIdentity = "Remote Collaborator";
        improvementOpportunity = "Turn off video cameras during large calls";
      } else {
        digitalIdentity = "Always On Viewer";
        improvementOpportunity = "Lower video stream resolution";
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `You are a thoughtful companion reflecting on a user's digital lifestyle.
Write a personalized, warm, and natural reflection (50-70 words) based on these inputs:
- Digital Identity: ${digitalIdentity}
- Annual Footprint: ${annualKg.toFixed(2)} kg CO2e
- Usage Metrics:
  * Emails & Chat: ${emails || 0} daily
  * AI Assistance: ${aiPrompts || 0} prompts daily
  * Video Streaming: ${streaming || 0} hours daily
  * Video Meetings: ${meetings || 0} hours weekly
  * Cloud Storage: ${storage || 0} GB
  * Social Feed: ${social || 0} hours daily

Guidelines:
1. Write a cohesive, natural paragraph. Do NOT use a formulaic sentence-by-sentence structure or templates like "As a [Digital Identity]...". Start the paragraph naturally.
2. The tone must be conversational, human, and empathetic, like a thoughtful friend giving personalized insights.
3. Contrast or connect their digital habits dynamically (e.g. if they have high AI prompts and low video streaming, highlight that their curiosity shapes their profile; if they have a balanced mix, note how casual daily interactions quietly add up).
4. Integrate their annual footprint score organically as a rounded number or float with exactly two decimal places.
5. Highlight their primary driver and suggest one simple, concrete adjustment in a supportive, actionable way.
6. Avoid database-style labels or technical jargon.
7. Absolutely do NOT use poetic AI clichés like 'invisible machinery', 'humming servers', 'virtual world', 'digital footprint', 'beautiful shadow', 'carbon footprint', 'virtual life', or 'digital ecosystem'.

Output format:
Return ONLY a raw JSON object:
{
  "narrative": "A natural, warm, and highly personalized paragraph (50-70 words) reflecting on their habits.",
  "futureNarrative": "A supportive, brief paragraph (under 50 words) showing how a small shift would feel lighter.",
  "futureTips": [
    "Tip 1 (under 8 words, specific and actionable)",
    "Tip 2 (under 8 words, specific and actionable)",
    "Tip 3 (under 8 words, specific and actionable)"
  ]
}`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: textResponse,
    };
  } catch (err) {
    console.error("Error in Netlify gemini function handler:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        error: "Internal Server Error", 
        message: err.message 
      }),
    };
  }
};
