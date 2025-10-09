// models/PurchaseOrder.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["CREATED", "SUBMITTED", "APPROVED", "REJECTED"],
    required: true
  },
  by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const purchaseOrderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
    default: "DRAFT"
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },


  history: [historySchema]
}, { timestamps: true });

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
