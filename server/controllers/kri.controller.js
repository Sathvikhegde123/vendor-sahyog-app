import KRI from "../models/KRIModule.js";
import { generateKRIsFromAI } from "../services/kriAI.service.js";

export const createKRI = async (req, res) => {
  try {
    // ✅ Auth safety
    if (!req.user || !req.user.vendorObjectId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { inputMode, rawTextInput, structuredInput } = req.body;

    if (!inputMode || !["TEXT", "STRUCTURED"].includes(inputMode)) {
      return res.status(400).json({ error: "Invalid inputMode" });
    }

    let aiInput;

    if (inputMode === "TEXT") {
      if (!rawTextInput) {
        return res.status(400).json({ error: "rawTextInput required" });
      }
      aiInput = { rawTextInput };
    }

    if (inputMode === "STRUCTURED") {
      if (!structuredInput) {
        return res.status(400).json({ error: "structuredInput required" });
      }
      aiInput = structuredInput;
    }

    // 🔥 Call AI
    const aiResult = await generateKRIsFromAI(aiInput);

    // ✅ Build payload ONCE
    const kriPayload = {
      vendorId: req.user.vendorObjectId, // ✅ ObjectId
      vendorCode: req.user.vendorCode,   // "VEN-713027"
      inputMode,
      rawTextInput,
      structuredInput,
      extractedContext: aiResult.extractedContext || {},
      risks: aiResult.risks || [],
      aiModelUsed: "groq-llama-3.1",
    };

    // 🔍 Debug (optional)
    console.log("FINAL KRI PAYLOAD:", kriPayload);

    // 🔥 Save to MongoDB
    const kri = await KRI.create(kriPayload);

    return res.status(201).json({
      message: "KRI generated successfully",
      kri,
    });
  } catch (err) {
    console.error("KRI AI Error:", err);
    return res.status(500).json({
      error: err.message,
    });
  }
};
