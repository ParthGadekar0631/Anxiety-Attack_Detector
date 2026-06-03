export const demoEpisodes = [
  { label: "Mon", risk: 42, stress: 5, sleep: 7 },
  { label: "Tue", risk: 57, stress: 6, sleep: 5 },
  { label: "Wed", risk: 76, stress: 8, sleep: 4 },
  { label: "Thu", risk: 51, stress: 6, sleep: 6 },
  { label: "Fri", risk: 84, stress: 9, sleep: 3 },
  { label: "Sat", risk: 63, stress: 7, sleep: 5 },
  { label: "Sun", risk: 36, stress: 4, sleep: 8 },
];

export const triggerBreakdown = [
  { name: "Crowded place", count: 5 },
  { name: "Work deadline", count: 4 },
  { name: "Poor sleep", count: 3 },
  { name: "Caffeine", count: 2 },
];

export function sparklinePoints(values: number[], width = 280, height = 92) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function riskTone(score: number) {
  if (score > 80) return "High";
  if (score > 60) return "Elevated";
  if (score > 30) return "Moderate";
  return "Low";
}
