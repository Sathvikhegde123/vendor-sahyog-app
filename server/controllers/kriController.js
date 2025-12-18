import KRI from "../models/KRI.js";
import { generateKRIsWithGemini } from "../services/geminiKRIService.js";

export default createKRI = async (req, res) => {
  try {
    const { inputMode, rawTextInput, structuredInput } = req.body;

    let aiPayload;

    if (inputMode === "TEXT") {
      aiPayload = { rawTextInput };
    } else if (inputMode === "STRUCTURED") {
      aiPayload = structuredInput;
    } else {
      return res.status(400).json({ error: "Invalid inputMode" });
    }

    // Call Gemini
    const aiResult = await generateKRIsWithGemini(aiPayload);

    // Save to DB
    const kri = await KRI.create({
      vendorId: req.user.vendorId,
      inputMode,
      rawTextInput,
      structuredInput,
      extractedContext: aiResult.extractedContext || {},
      risks: aiResult.risks || [],
      aiModelUsed: "gemini-1.5-flash",
    });

    res.status(201).json({
      message: "KRI generated successfully",
      kri,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
