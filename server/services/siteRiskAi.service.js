import Groq from "groq-sdk";

export const generateSiteRiskFromAI = async (inputPayload) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `
Respond ONLY with strictly valid JSON.
Do NOT include markdown, comments, headings, or any explanatory text outside the JSON.

Analyze the provided input data and infer realistic site, building, operational, and compliance context.

Return a single JSON object in the exact structure below and do not change key names or data types:

{
"extractedContext": {
"siteName": "",
"siteType": "",
"location": "",
"buildingProfile": "",
"dailyOccupancy": 0,
"criticalOperations": false
},
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

Risk generation requirements:

Include multiple risks, covering both high-risk and low-risk scenarios.

Risk descriptions must be 2–3 complete lines, clearly explaining:

what the risk is,

why it exists in this context,

and its potential impact.

Severity and likelihood must be integers from 1 (low) to 5 (high).

riskScore must be calculated as: severity × likelihood.

Mitigation recommendations must be practical, specific, and actionable.

Overall assessment rules:

overallRiskScore should realistically reflect the combined risk exposure (not a simple average).

complianceStatus must be one of:
"Compliant", "Partially Compliant", or "Non-Compliant".

Do not fabricate unrelated risks. Base all analysis strictly on the provided input data.

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
