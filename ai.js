import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Gemini API key missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateAIAdvice(metrics) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an academic performance coach.

Student habits:
- Study hours: ${metrics.studyHours}
- Sleep hours: ${metrics.sleepHours}
- Attendance: ${metrics.attendance}%
- Stress level: ${metrics.stressLevel}/5
- Revision: ${metrics.revisionFrequency}
- Screen time: ${metrics.screenTime} hours

Give 3 short, practical improvement tips.
No intro. Bullet points only.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return "• AI insights unavailable right now.\n• Please check API key.\n• Using fallback advice.";
  }
}
export async function compareHabitsAI(baseline, simulated) {
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-lite" });

  const prompt = `
You are an academic performance analyst.

Compare the student's BASELINE habits with WHAT-IF habits and explain the impact.

BASELINE:
Study: ${baseline.studyHours} hrs
Sleep: ${baseline.sleepHours} hrs
Attendance: ${baseline.attendance}%
Stress: ${baseline.stressLevel}/5
Revision: ${baseline.revisionFrequency}
Screen Time: ${baseline.screenTime} hrs

WHAT-IF:
Study: ${simulated.studyHours} hrs
Sleep: ${simulated.sleepHours} hrs
Attendance: ${simulated.attendance}%
Stress: ${simulated.stressLevel}/5
Revision: ${simulated.revisionFrequency}
Screen Time: ${simulated.screenTime} hrs

Rules:
- Give 3 short bullet points
- Explain ONLY differences
- Mention positive or negative impact
- No intro text

Example format:
• Increased sleep improved memory retention.
• Reduced stress lowered burnout risk.
• Daily revision increased recall efficiency.
`;

  const response = await model.generateContent(prompt);
  return response.response.text();
}

