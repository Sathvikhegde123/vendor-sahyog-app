import mongoose from "mongoose";

const KRISchema = new mongoose.Schema({
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    input: String,
    numberOfResponses: Number,
    risks: [
        {
            category: String,
            domain: String,
            risk_description: String,
            impact: Number,
            likelihood: Number,
            risk_score: Number,
            vulnerability: String,
            justification: String
        }
    ]
}, { timestamps: true });

export default mongoose.model("KRI", KRISchema);
