import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    enterpriseName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gstNumber: {
        type: String
    },
    vendorLicense: {
        type: String,
        required: true
    },
    address: {
        type: {
            locality: String,
            city: String,
            pincode: String,
            state: String,
            country: String
        }
    },
}, { timestamps: true });

export default mongoose.model('Vendor', VendorSchema);