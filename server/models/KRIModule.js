import mongoose from "mongoose";

const KRISchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    /* =========================
       1️⃣ INPUT MODE
       ========================= */
    inputMode: {
      type: String,
      enum: ["TEXT", "STRUCTURED"],
      required: true,
    },

    /* =========================
       2️⃣ FREE TEXT INPUT (OPTIONAL)
       ========================= */
    rawTextInput: {
      type: String,
      required: function () {
        return this.inputMode === "TEXT";
      },
    },

    /* =========================
       3️⃣ STRUCTURED INPUT (OPTIONAL)
       ========================= */
    structuredInput: {
      businessOverview: {
        industry: String,              // e.g. Retail, SaaS, Manufacturing
        productsOrServices: [String],  // e.g. CRM, Inventory Tool
        businessModel: String,          // B2B / B2C / SaaS / Hybrid
        annualRevenueRange: String,
        employeeCountRange: String,
      },

      operationalContext: {
        coreProcesses: [String],        // Procurement, Sales, Delivery
        keyDependencies: [String],      // Vendors, APIs, Cloud providers
        geographicPresence: [String],   // India, US, EU
        outsourcingLevel: String,       // Low / Medium / High
      },

      technologyContext: {
        techStack: [String],            // AWS, MongoDB, SAP
        dataSensitivity: {
          customerData: Boolean,
          financialData: Boolean,
          personalData: Boolean,
        },
        systemAvailabilityCriticality: String, // Low / Medium / High
      },

      complianceContext: {
        regulationsApplicable: [String], // GST, GDPR, ISO
        auditsFrequency: String,
        pastComplianceIssues: Boolean,
      },

      strategicContext: {
        growthPlans: String,
        marketCompetitionLevel: String,
        relianceOnKeyClients: String,
      },
    },

    /* =========================
       4️⃣ AI-EXTRACTED CONTEXT
       (From rawTextInput)
       ========================= */
    extractedContext: {
      type: Object, // normalized version of structuredInput
      default: {},
    },

    /* =========================
       5️⃣ AI-GENERATED RISKS
       ========================= */
    risks: [
      {
        riskCategory: {
          type: String, // Strategic, Operational, Financial, Cyber, Compliance
        },

        riskDomain: {
          type: String, // IT, Finance, HR, Legal, Supply Chain
        },

        riskTitle: String,

        riskDescription: String,

        impact: {
          type: Number, // 1–5
        },

        likelihood: {
          type: Number, // 1–5
        },

        riskScore: {
          type: Number, // impact × likelihood
        },

        keyVulnerability: String,

        businessJustification: String,

        mitigationRecommendation: String,
      },
    ],

    /* =========================
       6️⃣ META / AUDIT
       ========================= */
    generatedByAI: {
      type: Boolean,
      default: true,
    },

    aiModelUsed: {
      type: String, // gemini-1.5 / gpt-4o / etc
    },
  },
  { timestamps: true }
);

export default mongoose.model("KRI", KRISchema);
