import mongoose from "mongoose";

const BusinessContinuitySchema = new mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },

        /* =====================
           CORE BCP CONTENT
        ===================== */

        documents: [
            {
                title: String,
                type: String, // Policy, SOP, Playbook
                fileUrl: String,
            },
        ],

        workflows: [
            {
                name: String,
                trigger: String, // Cyber Attack, Flood, Power Outage
                steps: [String], // High-level steps (simplified)
            },
        ],

        responseProcedures: [
            {
                scenario: String,
                actions: [String],
                escalationContacts: [String],
            },
        ],

        /* =====================
           ACTIVATION & RESPONSE
        ===================== */

        activations: [
            {
                incidentType: String,
                activatedBy: String,
                activatedAt: {
                    type: Date,
                    default: Date.now,
                },
                notificationStatus: {
                    type: String,
                    enum: ["PENDING", "SENT", "FAILED"],
                },
            },
        ],

        /* =====================
           RECOVERY & REPORTING
        ===================== */

        recovery: [
            {
                incidentReference: String,
                steps: [String],
                status: {
                    type: String,
                    enum: ["IN_PROGRESS", "COMPLETED"],
                },
                recoveryTime: String,
            },
        ],

        postIncidentReports: [
            {
                incidentSummary: String,
                rootCause: String,
                lessonsLearned: [String],
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        /* =====================
           AI (GEMINI)
        ===================== */

        aiEnabled: {
            type: Boolean,
            default: true,
        },

        aiModelUsed: String,

        aiGeneratedContent: [
            {
                type: {
                    type: String,
                    enum: ["PROCEDURE", "RECOVERY", "REPORT"],
                },
                incidentType: String,
                content: Object, // flexible AI output
                reviewed: {
                    type: Boolean,
                    default: false,
                },
                generatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        /* =====================
           META
        ===================== */

        createdBy: String,
        lastReviewedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model(
    "BusinessContinuity",
    BusinessContinuitySchema
);
