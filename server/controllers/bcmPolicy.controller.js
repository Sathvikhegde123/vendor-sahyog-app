import BcmPolicy from "../models/BCPModule.js";
import { extractTextFromFile } from "../utils/extractText.util.js";
import { generateBcmPolicyInsights } from "../services/bcmPolicyAI.service.js";

export const uploadAndAnalyzePolicy = async (req, res) => {
  try {
    // ✅ FIX: use req.vendor (set by vendorAuth)
    if (!req.vendor) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let rawText = "";

    if (req.file) {
      rawText = await extractTextFromFile(req.file);
    } else if (req.body.rawTextInput) {
      rawText = req.body.rawTextInput;
    } else {
      return res.status(400).json({ error: "No policy input provided" });
    }

    // 🔥 AI Processing
    const aiResult = await generateBcmPolicyInsights(rawText);

    const bcmPolicy = await BcmPolicy.create({
      vendorId: req.vendor._id,           // ✅ ObjectId from DB
      vendorCode: req.vendor.vendorId,    // ✅ VEN-xxxx
      inputMode: req.file ? "UPLOAD" : "TEXT",
      policySource: {
        sourceType: req.file ? "UPLOAD" : "PLAINTEXT",
        filename: req.file?.originalname,
        fileType: req.file?.mimetype,
        rawText,
      },
      extractedClauses: aiResult.extractedClauses,
      gapAnalysis: aiResult.gapAnalysis,
      regeneratedPolicy: aiResult.regeneratedPolicy,
      generatedByAI: true,
      aiModelUsed: "llama-3.1-8b-instant",
      processedBy: "Vendor",
    });

    return res.status(201).json({
      message: "BCM Policy analyzed successfully",
      bcmPolicy,
    });
  } catch (err) {
    console.error("BCM Policy Error:", err);
    return res.status(500).json({
      error: "Failed to process BCM policy",
    });
  }
};
