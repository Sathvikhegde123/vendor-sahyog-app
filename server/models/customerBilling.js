import mongoose from "mongoose";

const CustomerBillingSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    customerId: String,
    customerName: String,
    customerEmail: String,
    customerPhone: String,

    demographics: {
      ageGroup: String,
      gender: String,
      location: String,
      incomeBracket: String,
    },

    // 🚨 Keep only business-critical values required
    invoiceNumber: {
      type: String,
      required: true,
    },

    transactionDate: {
      type: Date,
      required: true,
    },

    purchaseChannel: {
      type: String,
      enum: ["ONLINE", "IN_STORE", "APP", "PARTNER"],
    },

    paymentMethod: {
      type: String,
      enum: ["CARD", "UPI", "CASH", "WALLET", "NET_BANKING"],
    },

    items: [
      {
        productId: String,
        productName: String,
        category: String,
        subCategory: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],

    totalAmount: Number,
    discountApplied: Number,
    finalAmountPaid: Number,

    // 🧠 ML METRICS — NOT REQUIRED (computed later)
    rfmMetrics: {
      recencyDays: { type: Number, default: null },
      frequencyCount: { type: Number, default: null },
      totalSpendLifetime: { type: Number, default: null },
    },

    behaviorSignals: {
      repeatPurchase: { type: Boolean, default: null },
      cartSizeCategory: { type: String, default: null },
      purchaseIntentScore: { type: Number, default: null },
    },

    meta: {
      platform: String,
      device: String,
      ipLocation: String,
    },

    notes: String,
    isRefunded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CustomerBilling", CustomerBillingSchema);
