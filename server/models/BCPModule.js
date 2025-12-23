import mongoose from "mongoose";

const BcmPolicySchema = new mongoose.Schema(
  {
    /* =====================
       MULTI-TENANT CONTROL
    ===================== */

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    vendorCode: {
      type: String,
    },

    /* =====================
       POLICY SOURCE
    ===================== */

    policySource: {
      sourceType: {
        type: String,
        enum: ["UPLOAD", "PLAINTEXT"],
        required: true,
      },

      filename: String,
      fileType: String, // pdf / docx / txt

      rawText: String, // extracted or pasted policy text
    },

    /* =====================
       EXTRACTED CLAUSES
    ===================== */

    extractedClauses: [
      {
        clause: String, // ISO clause number (e.g. 5.3)
        existingText: String,
        requirementText: String, // ISO reference (optional)
        questions: [String], // AI-generated clarification questions
      },
    ],

    /* =====================
       GAP ANALYSIS
    ===================== */

    gapAnalysis: {
      totalClauses: Number,
      gapsFound: Number,

      summary: String,

      details: [
        {
          clause: String,
          requirement: String,
          present: Boolean,
          evidence: String,
          gapSeverity: {
            type: String,
            enum: ["Low", "Medium", "High"],
          },
          recommendation: String,
        },
      ],
    },

    /* =====================
       CLAUSE REFINEMENT
    ===================== */

    refinedClauses: [
      {
        clause: String,
        newText: String, // improved version
        regenerated: {
          type: Boolean,
          default: false,
        },
      },
    ],

    /* =====================
       FULL POLICY RENEWAL
    ===================== */

    regeneratedPolicy: {
      clauses: [
        {
          clause: String,
          existingText: String,
          newText: String,
          improvementSuggestions: [String],
        },
      ],
    },

    /* =====================
       META
    ===================== */

    versionNotes: String,

    generatedByAI: {
      type: Boolean,
      default: true,
    },

    aiModelUsed: String,

    processedBy: String, // user/admin
  },
  { timestamps: true }
);

export default mongoose.model("BcmPolicy", BcmPolicySchema);
