function riskCategory(score) {
  if (score <= 30) return "Low";
  if (score <= 60) return "Moderate";
  if (score <= 80) return "Elevated";
  return "High";
}

function recommendedIntervention(category) {
  if (category === "High") {
    return "Start guided breathing now and consider notifying an emergency contact if symptoms continue.";
  }
  if (category === "Elevated") {
    return "Begin the breathing guide and use a grounding exercise for the next few minutes.";
  }
  if (category === "Moderate") {
    return "Try a short grounding exercise and reduce immediate stimulation if possible.";
  }
  return "Keep monitoring and use preventive calming steps if symptoms increase.";
}

module.exports = { riskCategory, recommendedIntervention };
