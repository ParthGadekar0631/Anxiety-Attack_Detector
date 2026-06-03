const { env } = require("../config/env");

async function generateCalmingResponse(context = {}) {
  const category = context.riskCategory || "Moderate";
  const style = context.preferredCalmingStyle || "grounded";
  const trigger = context.triggerType || "current stressor";

  const emergencySuggestion =
    category === "High"
      ? "If symptoms feel unsafe or continue to escalate, use the contact alert or emergency services prompt."
      : "Stay with the next small step and reassess after one minute.";

  const response = {
    provider: env.aiProvider === "mock" || (!env.openAiApiKey && !env.geminiApiKey) ? "mock" : env.aiProvider,
    message: `You are not alone in this moment. Notice that ${trigger} is a signal to slow down, not a diagnosis.`,
    breathingInstruction: style === "direct"
      ? "Inhale for 4 seconds, hold for 2, exhale for 6. Repeat three times."
      : "Place one hand on your chest, inhale gently for 4 seconds, and exhale slowly for 6 seconds.",
    groundingInstruction: "Name five things you can see, four things you can feel, three things you can hear, two things you can smell, and one thing you can taste.",
    emergencySuggestion,
  };

  return response;
}

module.exports = { generateCalmingResponse };
