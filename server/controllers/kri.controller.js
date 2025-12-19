import KRI from "../models/KRIModule.js";
import { generateKRIsFromAI } from "../services/kriAI.service.js";

export const createKRI = async (req, res) => {
  try {
    // ✅ AUTH SAFETY (FIXED)
    if (!req.vendor || !req.vendor._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { inputMode, rawTextInput, structuredInput } = req.body;

    if (!inputMode || !["TEXT", "STRUCTURED"].includes(inputMode)) {
      return res.status(400).json({ error: "Invalid inputMode" });
    }

    let aiInput;

    if (inputMode === "TEXT") {
      if (!rawTextInput?.trim()) {
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

    // 🔥 CALL AI SERVICE
    const aiResult = await generateKRIsFromAI(aiInput);

    // ✅ BUILD PAYLOAD (FIXED)
    const kriPayload = {
      vendorId: req.vendor._id,              // ✅ Mongo ObjectId
      vendorCode: req.vendor.vendorId,       // ✅ "VEN-713027"
      inputMode,
      rawTextInput: rawTextInput || null,
      structuredInput: structuredInput || null,
      extractedContext: aiResult.extractedContext || {},
      risks: aiResult.risks || [],
      aiModelUsed: "groq-llama-3.1",
    };

    console.log("FINAL KRI PAYLOAD:", kriPayload);

    // 🔥 SAVE TO DB
    const kri = await KRI.create(kriPayload);

    return res.status(201).json({
      message: "KRI generated successfully",
      kri,
    });
  } catch (err) {
    console.error("KRI AI Error:", err);
    return res.status(500).json({
      error: "Failed to generate KRI",
    });
  }
};
