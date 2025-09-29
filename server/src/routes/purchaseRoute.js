const express = require("express");
const router = express.Router();
const PurchaseOrder = require("../models/purchaseRecord");
const { authMiddleware, roleCheck } = require("../middleware/auth");


router.post("/", authMiddleware, roleCheck("CREATOR"), async (req, res) => {
  try {
    const { title, description, amount } = req.body;

    const po = await PurchaseOrder.create({
      title,
      description,
      amount,
      status: "DRAFT",
      createdBy: req.user.id,
      history: [
        { action: "CREATED", by: req.user.id, timestamp: new Date() }
      ]
    });

    res.status(201).json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Submit PO (Creator only)
router.put("/:id/submit", authMiddleware, roleCheck("CREATOR"), async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "PO not found" });

    if (po.status !== "DRAFT") {
      return res.status(400).json({ error: "Only draft POs can be submitted" });
    }

    po.status = "SUBMITTED";
    if (req.body.assignedTo) {
      po.assignedTo = req.body.assignedTo;
    }
    po.history.push({
      action: "SUBMITTED",
      by: req.user.id,
      timestamp: new Date()
    });

    await po.save();
    res.json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Approve PO (Approver only)
router.put("/:id/approve", authMiddleware, roleCheck("APPROVER"), async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "PO not found" });

    if (po.status !== "SUBMITTED") {
      return res.status(400).json({ error: "Only submitted POs can be approved" });
    }

    po.status = "APPROVED";
    po.history.push({
      action: "APPROVED",
      by: req.user.id,
      comment: req.body.comment,
      timestamp: new Date()
    });

    await po.save();
    res.json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Reject PO (Approver only)
router.put("/:id/reject", authMiddleware, roleCheck("APPROVER"), async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "PO not found" });

    if (po.status !== "SUBMITTED") {
      return res.status(400).json({ error: "Only submitted POs can be rejected" });
    }

    po.status = "REJECTED";
    po.history.push({
      action: "REJECTED",
      by: req.user.id,
      comment: req.body.comment,
      timestamp: new Date()
    });

    await po.save();
    res.json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get all POs (Dashboard)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;

    const pos = await PurchaseOrder.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(pos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get PO details (with history)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("history.by", "name email");

    if (!po) return res.status(404).json({ error: "PO not found" });

    res.status(200).json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET /api/po/my?status=DRAFT or status=SUBMITTED
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const filter = { createdBy: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const pos = await PurchaseOrder.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(pos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Approved and Rejected POs created by logged-in user
router.get("/my/completed", authMiddleware, async (req, res) => {
  try {
    const completedPOs = await PurchaseOrder.find({
      createdBy: req.user.id,
      status: { $in: ["APPROVED", "REJECTED"] } // filter approved and rejected
    })
      .populate("assignedTo", "name email")  // show approver info
      .sort({ createdAt: -1 });             // latest first

    res.status(200).json(completedPOs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/approver/submitted", authMiddleware, roleCheck("APPROVER"), async (req, res) => {
  try {
    const submittedPOs = await PurchaseOrder.find({
      assignedTo: req.user.id,
      status: "SUBMITTED"
    })
      .populate("createdBy", "name email")  // show creator info
      .sort({ createdAt: -1 });            // latest first

    res.status(200).json(submittedPOs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;