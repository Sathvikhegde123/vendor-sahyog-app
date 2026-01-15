// src/models/ShoppingPatternMaster.js
import mongoose from "mongoose";

const ShoppingPatternSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false, // optional
    },

    category: {
      type: String,
      required: true,
      // Removed strict enum to allow any category from billing data
    },

    location: {
      type: String,
      required: true,
    },


    totalSpend: {
      type: Number,
      required: true,
    },

    peakHours: {
      type: [String], // e.g., ["10AM-12PM", "6PM-9PM"]
      required: false,
    },

    timeStamp: {
      type: Date,
      default: Date.now,
    },

    meta: {
      type: Object, // future flexibility (AI tags, pattern labels)
      default: {},
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
ShoppingPatternSchema.index({ vendorId: 1, timeStamp: -1 });
ShoppingPatternSchema.index({ vendorId: 1, category: 1 });
ShoppingPatternSchema.index({ vendorId: 1, location: 1 });

const ShoppingPattern = mongoose.model(
  "ShoppingPattern",
  ShoppingPatternSchema
);

export default ShoppingPattern;
