import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    moduleName: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    taxAmount: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending",
    },

    paymentDate: {
      type: Date,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    flags: [
      {
        reason: String,
        severity: { type: String, enum: ["Low", "Medium", "High"] },
        flaggedOn: { type: Date, default: Date.now },
      },
    ],

    anomalies: [
      {
        description: String,
        detectedAt: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const BillingModule = mongoose.model("BillingModule", BillingSchema);

export default BillingModule;
