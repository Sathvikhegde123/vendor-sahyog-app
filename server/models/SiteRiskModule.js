import mongoose from 'mongoose';

const SiteRiskSchema = new mongoose.Schema({
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    site_name: String,
    locality: String,
    city: String,
    state: String,
    no_of_floors: Number,
    carpet_area_sqft: Number,
    construction_material: String,
    fire_safety_equipment: String,
    last_fire_drill: Date,
    insurance_provider: String,
    insurance_expiry: Date,
    risk_parameters_json: Object,
    calculated_risk_score: Number,
    supporting_documents: String,
    compliance_status: String,
}, { timestamps: true });

export default mongoose.model('SiteRisk', SiteRiskSchema);