import Groq from "groq-sdk";

export const generateKRIsFromAI = async (inputPayload) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not loaded");
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `
Respond ONLY with valid JSON.
No markdown. No explanation.

Return JSON:
{
  "extractedContext": {},
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

Business Input:
${JSON.stringify(inputPayload, null, 2)}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const text = completion.choices[0].message.content;
  return JSON.parse(text);
};
