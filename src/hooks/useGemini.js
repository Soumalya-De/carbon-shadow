import { useCallback } from 'react';
import { puter } from '@heyputer/puter.js';
import { useCarbonShadow } from '../context/CarbonShadowContext';

// Local fallback narrative generator (60-80 words, warm, conversational, second-person storytelling)
const getFallbackNarrative = (archetypeType) => {
  const type = archetypeType ? archetypeType.toLowerCase() : "";

  if (type.includes('native') || type.includes('wanderer') || type.includes('minimalist')) {
    return {
      narrative: "Your digital footprint is actually quite light and careful. Most of the weight comes from keeping messages and files synced in the background. It is like leaving a tap dripping slowly; you do not notice it, but it adds up over time. Turning off automatic syncing for things you do not need right away is a simple way to keep your footprint even smaller.",
      futureNarrative: "With a few minor updates, your digital space will feel much cleaner and quieter. By setting files to sync only when you request it and pruning old email threads, you stop the steady, silent background energy draw. Your shadow will become even lighter, leaving a tiny mark on the world while keeping you connected to what matters.",
      futureTips: [
        "Prune obsolete email lists weekly.",
        "Use audio instead of video calls.",
        "Bookmark pages instead of searching repeatedly."
      ]
    };
  } else if (type.includes('explorer') || type.includes('ai')) {
    return {
      narrative: "Your digital shadow is mostly shaped by constant searching and AI tools. Every time you ask a question or generate an image, powerful remote computers work to find the answer. It feels instant, but it takes constant energy to keep those systems ready. Saving common answers on your device and grouping your questions helps reduce this background effort.",
      futureNarrative: "You can easily soften your digital impact without changing how you learn. Try keeping a small text file of common prompts and answers on your desktop so you do not have to generate them again. Grouping your questions into one short session instead of typing them throughout the day keeps those remote computers at rest.",
      futureTips: [
        "Group prompt clusters together.",
        "Save frequent AI replies locally.",
        "Use basic search for simple queries."
      ]
    };
  } else if (type.includes('collector') || type.includes('heavy')) {
    return {
      narrative: "Your digital shadow grows from saving things you might not need again. Storing photos, old emails, and continuous backups in the cloud keeps remote storage drives spinning all day and night. It feels like a silent attic that never gets full, but it uses power constantly. Cleaning out old files and disabling automatic backups makes a big difference.",
      futureNarrative: "Tidying up your cloud spaces makes a bigger difference than you might think. When you turn off continuous photo backups and organize old folders, those remote storage systems can finally rest. It is like turning off the lights in a room you are not using, leaving you with a lighter and much cleaner digital footprint.",
      futureTips: [
        "Limit background video autoplay.",
        "De-duplicate cloud storage buckets monthly.",
        "Deactivate continuous automatic photo syncing."
      ]
    };
  } else if (type.includes('connected') || type.includes('creator') || type.includes('giant')) {
    return {
      narrative: "Your shadow grows largest when video follows you throughout the day. Meetings, streaming and always-available cloud storage quietly add weight in the background. None of these actions feel significant on their own, but together they create the strongest part of your digital footprint. The easiest place to begin is video quality. Small reductions there create surprisingly large changes.",
      futureNarrative: "Making a few small choices will quickly shrink your digital shadow. Toggling your video off during large online calls or letting movies stream in standard definition instead of high definition saves a lot of hidden energy. You will still enjoy everything you do, but with the quiet satisfaction of a much lighter, cleaner digital footprint.",
      futureTips: [
        "Turn off camera in large meetings.",
        "Prune massive cloud storage archives.",
        "Switch off background sync features."
      ]
    };
  } else {
    return {
      narrative: "Your daily digital activity is evenly spread across searching, messaging, and social browsing. No single habit dominates, but your combined casual habits quietly create most of your footprint. Disabling video autoplay on social media feeds would create the biggest improvement.",
      futureNarrative: "You are already in a great position to keep your shadow under control. By making simple habits like deleting old chat threads or listening to downloaded music instead of streaming it every time, you prevent constant energy loops. These tiny actions accumulate over a year, leaving you with an incredibly light, healthy, and sustainable digital presence.",
      futureTips: [
        "Purge email junk folders monthly.",
        "Opt for standard resolution streams.",
        "Download recurring playlists locally."
      ]
    };
  }
};

/**
 * Clean and strip any markdown backticks from LLM output before parsing.
 */
function cleanJSONString(str) {
  let cleaned = str.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

export function useGemini() {
  const { 
    baselineArchetype, 
    setGeminiLoading, 
    setGeminiReading, 
    setGeminiError,
    footprint
  } = useCarbonShadow();

  const fetchReading = useCallback(async (traces) => {
    setGeminiLoading(true);
    try {
      const { emails, aiPrompts, streaming, meetings, storage, social } = traces;

      const prompt = `You are a thoughtful companion reflecting on a user's digital lifestyle.
Write a personalized, warm, and natural reflection (50-70 words) based on these inputs:
- Digital Identity: ${baselineArchetype?.type || 'Digital Explorer'}
- Annual Footprint: ${(footprint?.totalAnnualKg || 150).toFixed(2)} kg CO2e
- Usage Metrics:
  * Emails & Chat: ${traces.emails} daily
  * AI Assistance: ${traces.aiPrompts} prompts daily
  * Video Streaming: ${traces.streaming} hours daily
  * Video Meetings: ${traces.meetings} hours weekly
  * Cloud Storage: ${traces.storage} GB
  * Social Feed: ${traces.social} hours daily

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
      // Call Puter's keyless Gemini API directly
      const response = await puter.ai.chat(prompt, {
        model: 'gemini-3.5-flash'
      });

      // Handle cases where Puter returns a Message object instead of a direct string
      let responseText = "";
      if (typeof response === 'string') {
        responseText = response;
      } else if (response && response.text) {
        responseText = response.text;
      } else if (response && typeof response.toString === 'function') {
        responseText = response.toString();
      }

      if (!responseText) {
        throw new Error("Received empty response from Puter AI API");
      }

      const cleanedText = cleanJSONString(responseText);
      const data = JSON.parse(cleanedText);

      if (data && data.narrative) {
        setGeminiReading({
          narrative: data.narrative,
          futureNarrative: data.futureNarrative || "Awaiting your optimized footprint actions...",
          futureTips: data.futureTips || [
            "Opt for standard resolution streaming when high-definition is redundant.",
            "De-duplicate cloud storage buckets to release server capacity.",
            "Switch video feeds to audio-only during large corporate meetings."
          ]
        });
      } else {
        throw new Error("Invalid response JSON schema");
      }
    } catch (err) {
      console.warn("Puter.js AI call failed, falling back to local curator narrative generator:", err.message);
      
      // Artificial delay to make loading state feel premium and realistic
      await new Promise(resolve => setTimeout(resolve, 1400));
      
      const archetypeType = baselineArchetype ? baselineArchetype.type : "Casual";
      const fallbackData = getFallbackNarrative(archetypeType);
      
      setGeminiReading(fallbackData);
    }
  }, [baselineArchetype, setGeminiLoading, setGeminiReading]);

  return { fetchReading };
}
