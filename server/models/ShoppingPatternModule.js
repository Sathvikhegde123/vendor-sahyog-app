// src/models/ShoppingPatternMaster.js
import mongoose from "mongoose";

const ShoppingPatternSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false, // optional
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Footwear",
        "Clothing",
        "Electronics",
        "Groceries",
        "Furniture",
        "Other",
      ],
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

const ShoppingPattern = mongoose.model(
  "ShoppingPattern",
  ShoppingPatternSchema
);

export default ShoppingPattern;
