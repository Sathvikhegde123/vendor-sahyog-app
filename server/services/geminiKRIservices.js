import fetch from "node-fetch";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const generateKRIsWithGemini = async (payload) => {
  const prompt = `
You are a risk management expert.

Given the following business information, generate key risk indicators.

Return ONLY valid JSON in the following format:

{
  "extractedContext": { ... },
  "risks": [
    {
      "riskCategory": "",
      "riskDomain": "",
      "riskTitle": "",
      "riskDescription": "",
      "impact": 1,
      "likelihood": 1,
      "riskScore": 1,
      "keyVulnerability": "",
      "businessJustification": "",
      "mitigationRecommendation": ""
    }
  ]
}

Business Information:
${JSON.stringify(payload, null, 2)}
`;

  const response = await fetch(
    `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  const rawText =
    data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("No response from Gemini");
  }

  // IMPORTANT: Gemini returns text → parse JSON
  return JSON.parse(rawText);
};
