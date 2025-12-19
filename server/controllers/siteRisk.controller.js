import SiteRisk from "../models/SiteRiskModule.js";
import { generateSiteRiskFromAI } from "../services/siteRiskAi.service.js";

export const createSiteRisk = async (req, res) => {
  try {
    if (!req.user || !req.user.vendorObjectId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { inputMode, rawTextInput, structuredInput } = req.body;

    let aiInput;

    if (inputMode === "TEXT") {
      aiInput = { rawTextInput };
    } else {
      aiInput = structuredInput;
    }

    const aiResult = await generateSiteRiskFromAI(aiInput);

    const siteRiskPayload = {
      vendorId: req.user.vendorObjectId,
      vendorCode: req.user.vendorCode,
      inputMode,
      rawTextInput,
      structuredInput,
      extractedContext: aiResult.extractedContext,
      risks: aiResult.risks,
      overallRiskScore: aiResult.overallRiskScore,
      complianceStatus: aiResult.complianceStatus,
      aiModelUsed: "groq-llama-3.1",
    };

    const siteRisk = await SiteRisk.create(siteRiskPayload);

    res.status(201).json({
      message: "Site Risk assessment generated",
      siteRisk,
    });
  } catch (err) {
    console.error("Site Risk Error:", err);
    res.status(500).json({ error: err.message });
  }
};
