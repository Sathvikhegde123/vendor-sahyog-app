import Groq from "groq-sdk";

export const generateBcmPolicyInsights = async (policyText) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY missing. Check .env file.");
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
const prompt = `
You are an ISO 22301 BCM expert.

Tasks:
1. Extract BCM policy clauses (ISO-style numbering if possible)
2. Identify gaps vs ISO 22301 expectations
3. Generate improvement suggestions
4. Provide compliance summary

Respond ONLY with valid JSON:

{
  "extractedClauses": [
    {
      "clause": "5.3",
      "existingText": "",
      "requirementText": "",
      "questions": []
    }
  ],
  "gapAnalysis": {
    "summary": "",
    "totalClauses": 0,
    "gapsFound": 0,
    "details": [
      {
        "clause": "",
        "requirement": "",
        "present": true,
        "evidence": "",
        "gapSeverity": "Low",
        "recommendation": ""
      }
    ]
  },
  "regeneratedPolicy": {
    "clauses": [
      {
        "clause": "",
        "existingText": "",
        "newText": "",
        "improvementSuggestions": []
      }
    ]
  }
}

Policy Text:
${policyText}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return JSON.parse(completion.choices[0].message.content);
  // rest of code...
};


