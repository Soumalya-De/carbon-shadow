export const moodLibrary = {
  types: {
    minimalist: {
      name: "Mindful Explorer",
      description: "Your digital activity is deliberate, keeping your footprint light and focused."
    },
    casual: {
      name: "Digital Generalist",
      description: "Your footprint is spread across multiple digital habits rather than one dominant activity."
    },
    heavy: {
      name: "Remote Collaborator",
      description: "Most of your footprint comes from staying connected through work and communication."
    },
    aiExplorer: {
      name: "Curious Explorer",
      description: "You frequently use AI and digital tools to learn, explore and solve problems."
    },
    giant: {
      name: "Always Connected",
      description: "Entertainment and video consumption form the largest part of your digital activity."
    }
  },
  moods: {
    clear: {
      name: "Light",
      color: "#ffffff", // White
      bgGlow: "rgba(255, 255, 255, 0.08)"
    },
    mist: {
      name: "Moderate",
      color: "#00f0ff", // Cyan
      bgGlow: "rgba(0, 240, 255, 0.12)"
    },
    static: {
      name: "Significant",
      color: "#9d4edd", // Purple
      bgGlow: "rgba(157, 78, 221, 0.12)"
    },
    fog: {
      name: "High",
      color: "#9d4edd", // Purple
      bgGlow: "rgba(157, 78, 221, 0.12)"
    },
    storm: {
      name: "Very High",
      color: "#9d4edd", // Purple
      bgGlow: "rgba(157, 78, 221, 0.12)"
    }
  }
};

/**
 * Returns the shadow archetype based on footprint data
 */
export function getShadowArchetype(breakdown, annualKg) {
  // Determine primary contributor
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

  // Determine weight & type
  let typeKey = "casual";
  let weight = "Moderate";
  let moodKey = "mist";

  if (annualKg < 30) {
    typeKey = "minimalist";
    weight = "Light";
    moodKey = "clear";
  } else if (annualKg < 100) {
    typeKey = "casual";
    weight = "Moderate";
    moodKey = "mist";
  } else if (annualKg < 220) {
    if (primaryKey === "aiPrompts") {
      typeKey = "aiExplorer";
    } else if (primaryKey === "meetings" || primaryKey === "storage") {
      typeKey = "heavy";
    } else {
      typeKey = "giant";
    }
    weight = "Significant";
    moodKey = "static";
  } else if (annualKg < 500) {
    if (primaryKey === "aiPrompts") {
      typeKey = "aiExplorer";
    } else if (primaryKey === "meetings" || primaryKey === "storage") {
      typeKey = "heavy";
    } else {
      typeKey = "giant";
    }
    weight = "High";
    moodKey = "fog";
  } else {
    if (primaryKey === "aiPrompts") {
      typeKey = "aiExplorer";
    } else if (primaryKey === "meetings" || primaryKey === "storage") {
      typeKey = "heavy";
    } else {
      typeKey = "giant";
    }
    weight = "Very High";
    moodKey = "storm";
  }

  const typeInfo = moodLibrary.types[typeKey];
  const moodInfo = moodLibrary.moods[moodKey];

  return {
    type: typeInfo.name,
    typeDescription: typeInfo.description,
    mood: moodInfo.name,
    moodColor: moodInfo.color,
    moodBgGlow: moodInfo.bgGlow,
    primaryContributor,
    weight,
  };
}

/**
 * Maps baseline digital identity names to their evolved mindful future versions.
 */
export function getEvolvedIdentity(originalName) {
  const mapping = {
    "Always Connected": "Mindful Creator",
    "Remote Collaborator": "Efficient Collaborator",
    "Curious Explorer": "Mindful Creator",
    "Digital Generalist": "Signal Aware",
    "Mindful Explorer": "Zero-Waste Citizen"
  };
  return mapping[originalName] || originalName;
}
