import mongoose from 'mongoose';

const BCPSchema = new mongoose.Schema({
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    
});