import Groq from "groq-sdk";

export const generateSiteRiskFromAI = async (inputPayload) => {
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
      "riskDescription": "",
      "severity": 1,
      "likelihood": 1,
      "riskScore": 1,
      "mitigationRecommendation": ""
    }
  ],
  "overallRiskScore": 1,
  "complianceStatus": ""
}

Site Input:
${JSON.stringify(inputPayload, null, 2)}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return JSON.parse(completion.choices[0].message.content);
};
