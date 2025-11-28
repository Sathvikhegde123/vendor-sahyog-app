import mongoose from "mongoose";

const { Schema } = mongoose;

const ChecklistItemSchema = new Schema({
    item: { type: String, required: true },
    status: { type: String, enum: ["Not Checked", "Compliant", "Non-Compliant", "NA"], default: "Not Checked" },
    notes: { type: String },
    checkedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    checkedAt: { type: Date }
}, { _id: false });

const EvidenceSchema = new Schema({
    title: { type: String },
    description: { type: String },
    url: { type: String, required: true },
    mimeType: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const FindingSchema = new Schema({
    findingId: { type: String }, // optional custom id
    observation: { type: String, required: true },
    rootCause: { type: String },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    riskRating: { type: Number, min: 0, max: 100 },
    recommendation: { type: String },
    evidence: [EvidenceSchema],
    owner: { type: Schema.Types.ObjectId, ref: "Employee" }, // person responsible
    dueDate: { type: Date },
    status: { type: String, enum: ["Open", "In Progress", "Resolved", "Deferred", "Closed"], default: "Open" },
    createdAt: { type: Date, default: Date.now },
    closedAt: { type: Date }
}, { _id: false });

const CorrectiveActionSchema = new Schema({
    actionId: { type: String },
    description: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Employee" },
    plannedStart: { type: Date },
    plannedEnd: { type: Date },
    actualStart: { type: Date },
    actualEnd: { type: Date },
    status: { type: String, enum: ["Planned", "In Progress", "Completed", "Blocked"], default: "Planned" },
    notes: { type: String }
}, { _id: false });

const InternalAuditSchema = new Schema({
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", index: true }, // optional multi-tenant link
    auditName: { type: String, required: true, trim: true },
    auditCode: { type: String, index: true }, // e.g., AUD-2025-001
    auditType: { type: String, enum: ["Internal", "External", "Compliance", "Operational", "IT", "Financial", "Health & Safety"], default: "Internal" },
    scope: { type: String }, // textual scope
    objectives: { type: [String], default: [] },
    standardsChecked: { type: [String], default: [] }, // ISO references, regulations etc.
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["Planned", "Ongoing", "Completed", "Cancelled", "Reported"], default: "Planned" },
    auditors: [{ type: Schema.Types.ObjectId, ref: "Employee" }], // audit team
    auditOwner: { type: Schema.Types.ObjectId, ref: "Employee" }, // primary owner
    checklist: { type: [ChecklistItemSchema], default: [] },
    evidence: { type: [EvidenceSchema], default: [] },
    findings: { type: [FindingSchema], default: [] },
    correctiveActions: { type: [CorrectiveActionSchema], default: [] },

    // Summary / metrics
    totalFindings: { type: Number, default: 0 },
    findingSeveritySummary: {
        low: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        high: { type: Number, default: 0 },
        critical: { type: Number, default: 0 }
    },
    overallAuditScore: { type: Number, min: 0, max: 100 }, // computed metric

    // Compliance & risk
    complianceStatus: { type: String, enum: ["Compliant", "Non-Compliant", "Partial"], default: "Partial" },
    riskAssessment: {
        score: { type: Number, min: 0, max: 100 },
        riskItems: { type: [String], default: [] },
        notes: { type: String }
    },

    // Reporting & workflow
    reportUrl: { type: String }, // final audit report
    reportVersion: { type: String },
    distributedTo: [{ type: String }], // emails or groups
    distributionLog: { type: [{ to: String, sentAt: Date, method: String, notes: String }], default: [] },

    // Metadata & governance
    isConfidential: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    references: { type: [String], default: [] }, // link to policies/procedures
    notes: { type: String },

    // Audit trail for changes (lightweight)
    auditLogs: {
        type: [{ user: { type: Schema.Types.ObjectId, ref: "Employee" }, action: String, timestamp: Date, details: String }],
        default: []
    },

    // closure info
    closureDate: { type: Date },
    closedBy: { type: Schema.Types.ObjectId, ref: "Employee" },

    // Versioning
    version: { type: Number, default: 1 }
}, {
    timestamps: true,
    collection: "audit_master"
});

/**
 * Indexes (helpful for queries)
 */
InternalAuditSchema.index({ auditCode: 1, vendor: 1 });
InternalAuditSchema.index({ auditName: "text", scope: "text", objectives: "text" });

/**
 * Pre-save hooks (example: keep totals in sync)
 */
InternalAuditSchema.pre("save", function (next) {
    try {
        if (this.findings && Array.isArray(this.findings)) {
            this.totalFindings = this.findings.length;
            // recalc severity summary
            const summary = { low: 0, medium: 0, high: 0, critical: 0 };
            this.findings.forEach(f => {
                if (!f || !f.severity) return;
                const s = f.severity.toLowerCase();
                if (s === "low") summary.low++;
                else if (s === "medium") summary.medium++;
                else if (s === "high") summary.high++;
                else if (s === "critical") summary.critical++;
            });
            this.findingSeveritySummary = summary;
        }
        // optionally compute an overall score (simple heuristic)
        if (this.findingSeveritySummary) {
            const score = 100 - (this.findingSeveritySummary.medium * 2 + this.findingSeveritySummary.high * 5 + this.findingSeveritySummary.critical * 10);
            this.overallAuditScore = Math.max(0, Math.min(100, Math.round(score)));
        }
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model("InternalAudit", InternalAuditSchema);