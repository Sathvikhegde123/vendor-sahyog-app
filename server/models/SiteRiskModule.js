import mongoose from "mongoose";

const SiteRiskSchema = new mongoose.Schema(
  {
    // 🔐 Multi-tenant isolation
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    vendorCode: {
      type: String, // VEN-713027 (display only)
    },

    // 🧠 Input mode
    inputMode: {
      type: String,
      enum: ["TEXT", "STRUCTURED"],
      required: true,
    },

    rawTextInput: {
      type: String,
      required: function () {
        return this.inputMode === "TEXT";
      },
    },

    structuredInput: {
      siteIdentity: {
        siteName: String,
        siteType: String, // Office, Warehouse, Factory
        ownershipType: String, // Owned / Rented
      },

      locationDetails: {
        locality: String,
        city: String,
        state: String,
        country: String,
        seismicZone: String,
        floodZone: Boolean,
      },

      buildingDetails: {
        numberOfFloors: Number,
        carpetAreaSqFt: Number,
        constructionMaterial: String,
        buildingAgeYears: Number,
      },

      safetyInfrastructure: {
        fireSafetyEquipment: [String], // Extinguishers, Sprinklers
        emergencyExits: Number,
        lastFireDrill: Date,
        cctvInstalled: Boolean,
        accessControlSystem: Boolean,
      },

      complianceAndInsurance: {
        insuranceProvider: String,
        insuranceExpiry: Date,
        fireNOC: Boolean,
        occupancyCertificate: Boolean,
        lastSafetyAuditDate: Date,
      },

      operationalContext: {
        dailyOccupancy: Number,
        hazardousMaterialsPresent: Boolean,
        criticalOperations: Boolean,
      },
    },

    // 🔍 AI-normalized context
    extractedContext: {
      type: Object,
      default: {},
    },

    // ⚠️ Risk output
    risks: [
      {
        riskCategory: String, // Fire, Structural, Compliance
        riskDescription: String,
        severity: Number, // 1–5
        likelihood: Number, // 1–5
        riskScore: Number,
        mitigationRecommendation: String,
      },
    ],

    overallRiskScore: {
      type: Number,
    },

    complianceStatus: {
      type: String,
      enum: ["Compliant", "Partially Compliant", "Non-Compliant"],
    },

    generatedByAI: {
      type: Boolean,
      default: true,
    },

    aiModelUsed: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteRisk", SiteRiskSchema);
