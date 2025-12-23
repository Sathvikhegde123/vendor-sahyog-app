import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    moduleCode: {
      type: String, // e.g. "KRI", "SITE_RISK", "BCM"
      required: true,
    },

    moduleName: {
      type: String, // Human readable
      required: true,
    },

    pricing: {
      amount: Number,
      currency: {
        type: String,
        default: "INR",
      },
      billingCycle: {
        type: String,
        enum: ["MONTHLY", "YEARLY", "ONE_TIME"],
      },
    },

    license: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "PENDING", "CANCELLED"],
        default: "ACTIVE",
      },
    },

    payment: {
      paymentMode: String, // UPI, Card, NetBanking
      transactionId: String,
      paymentStatus: {
        type: String,
        enum: ["SUCCESS", "FAILED", "PENDING"],
      },
      paidAt: Date,
    },

    purchasedBy: {
      type: String, // VendorAdmin email or ID
    },
  },
  { timestamps: true }
);

export default mongoose.model("Billing", BillingSchema);
