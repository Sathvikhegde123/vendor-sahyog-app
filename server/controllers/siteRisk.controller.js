import SiteRisk from "../models/SiteRiskModule.js";
import { generateSiteRiskFromAI } from "../services/siteRiskAi.service.js";

export const createSiteRisk = async (req, res) => {
  try {
    if (!req.vendor || !req.vendor._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { inputMode, rawTextInput, structuredInput } = req.body;

    let aiInput =
      inputMode === "TEXT"
        ? { rawTextInput }
        : structuredInput;

    const aiResult = await generateSiteRiskFromAI(aiInput);

    const siteRisk = await SiteRisk.create({
      vendorId: req.vendor._id,        // ✅ correct source
      vendorCode: req.vendor.vendorId, // VEN-xxxx
      inputMode,
      rawTextInput,
      structuredInput,
      extractedContext: aiResult.extractedContext,
      risks: aiResult.risks,
      overallRiskScore: aiResult.overallRiskScore,
      complianceStatus: aiResult.complianceStatus,
      aiModelUsed: "groq-llama-3.1",
    });

    return res.status(201).json({
      message: "Site Risk assessment generated",
      siteRisk,
    });
  } catch (err) {
    console.error("Site Risk Error:", err);
    res.status(500).json({ error: err.message });
  }
};
