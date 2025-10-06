const express = require("express");
const router = express.Router();
const PurchaseOrder = require("../models/purchaseRecord");
const { authenticateToken, roleCheck } = require("../middleware/auth");


router.post("/po", authenticateToken, roleCheck("CREATOR"), async (req, res) => {
  try {
    
    const { title, description, amount } = req.body;

    const po = await PurchaseOrder.create({
      title,
      description,
      amount,
      status: "DRAFT",
      createdBy: req.user.userId,
      history: [
        { action: "CREATED", by: req.user.userId, timestamp: new Date() }
      ]
    });

    res.status(201).json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Submit PO (Creator only)
router.put("/po/:id/submit", authenticateToken, roleCheck("CREATOR"), async (req, res) => {
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
      by: req.user.userId,
      timestamp: new Date()
    });

    await po.save();
    res.json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Approve PO (Approver only)
router.put("/po/:id/approve", authenticateToken, roleCheck("APPROVER"), async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "PO not found" });

    if (po.status !== "SUBMITTED") {
      return res.status(400).json({ error: "Only submitted POs can be approved" });
    }

    po.status = "APPROVED";
    po.history.push({
      action: "APPROVED",
      by: req.user.userId,
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
router.put("/po/:id/reject", authenticateToken, roleCheck("APPROVER"), async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "PO not found" });

    if (po.status !== "SUBMITTED") {
      return res.status(400).json({ error: "Only submitted POs can be rejected" });
    }

    po.status = "REJECTED";
    po.history.push({
      action: "REJECTED",
      by: req.user.userId,
      comment: req.body.comment,
      timestamp: new Date()
    });

    await po.save();
    res.json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // 📌 Get all POs (Dashboard)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     const filter = {};
//     if (req.query.status) filter.status = req.query.status;
//     if (req.query.createdBy) filter.createdBy = req.query.createdBy;

//     const pos = await PurchaseOrder.find(filter)
//       .populate("createdBy", "name email")
//       .populate("approvedBy", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json(pos);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 📌 Get PO details (with history)
// router.get("/po/:id", authenticateToken, async (req, res) => {
//   try {
//     const po = await PurchaseOrder.findById(req.params.id)
//       .populate("createdBy", "name email")
//       .populate("assignedTo", "name email")
//       .populate("history.by", "name email");

//     if (!po) return res.status(404).json({ error: "PO not found" });

//     res.status(200).json(po);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// GET /api/po/my?status=DRAFT or status=SUBMITTED
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const filter = { createdBy: req.user.userId };
    if (req.query.status) filter.status = req.query.status;

    const pos = await PurchaseOrder.find(filter)
      
      .sort({ createdAt: -1 });

    res.status(200).json(pos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Approved and Rejected POs created by logged-in user
// router.get("/my/completed", authenticateToken, async (req, res) => {
//   try {
//     const completedPOs = await PurchaseOrder.find({
//       createdBy: req.user.userId,
//       status: { $in: ["APPROVED", "REJECTED"] } // filter approved and rejected
//     })
//       .populate("assignedTo", "name email")  // show approver info
//       .sort({ createdAt: -1 });             // latest first

//     res.status(200).json(completedPOs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.get("/approver/submitted", authenticateToken, roleCheck("APPROVER"), async (req, res) => {
//   try {
//     const submittedPOs = await PurchaseOrder.find({
      
//       status: "SUBMITTED"
//     })
//       .populate("createdBy", "name email")  
//       .sort({ createdAt: -1 });           

//     res.status(200).json(submittedPOs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


router.get("/", authenticateToken, async (req, res) => {
  try {
    // Optional query filters
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;

    // Fetch all purchase orders with related user data
    const pos = await PurchaseOrder.find(filter)
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email")
      .populate("history.by", "name email")
      .sort({ createdAt: -1 });

    // Format data for frontend
    const formattedList = pos.map(po => ({
      id: po._id.toString(),
      title: po.title,
      description: po.description,
      amount: po.amount,
      createdBy: po.createdBy?.name || "Unknown",
      status: po.status,
      createdAt: po.createdAt,
      history: po.history.map(h => ({
        action: h.action,
        by: h.by?.name || "Unknown",
        comment: h.comment,
        timestamp: h.timestamp
      }))
    }));

    return res.status(200).json(formattedList);
  } catch (err) {
    console.error("Error fetching purchase orders:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});


router.get("/my/completed", authenticateToken, async (req, res) => {
  try {
    const completedPOs = await PurchaseOrder.find({
      createdBy: req.user.userId,
      status: { $in: ["APPROVED", "REJECTED"] }
    })
      .populate("createdBy", "name email")   // include creator info
      .populate("approvedBy", "name email")  // include approver info
      .sort({ createdAt: -1 });

    // map to match dummy data structure
    const formattedPOs = completedPOs.map(po => ({
      _id: po._id,
      title: po.title,
      description: po.description,
      amount: po.amount,
      status: po.status,
      createdBy: po.createdBy
        ? { _id: po.createdBy._id, name: po.createdBy.name }
        : null,
      approvedBy: po.approvedBy
        ? { _id: po.approvedBy._id, name: po.approvedBy.name }
        : null,
      history: po.history
        ? po.history.map(h => ({
            action: h.action,
            by: h.by
              ? { _id: h.by._id, name: h.by.name }
              : null,
            comment: h.comment || null,
            timestamp: h.timestamp
          }))
        : []
    }));

    res.status(200).json(formattedPOs);
  } catch (err) {
    console.error("Error fetching completed POs:", err);
    res.status(500).json({ error: err.message });
  }
});


//approver submitted data
router.get(
  "/approver/submitted",
  authenticateToken,
  roleCheck("APPROVER"),
  async (req, res) => {
    try {
      // Fetch all purchase orders with SUBMITTED status
      const submittedPOs = await PurchaseOrder.find({ status: "SUBMITTED" })
        .populate("createdBy", "name email")
        .populate("history.by", "name email")
        .sort({ createdAt: -1 });

      // Format data for frontend (no approvedBy)
      const formattedData = submittedPOs.map((po) => ({
        _id: po._id,
        title: po.title,
        description: po.description,
        amount: po.amount,
        status: po.status,
        createdBy: po.createdBy
          ? { _id: po.createdBy._id, name: po.createdBy.name }
          : null,
        history: po.history.map((h) => ({
          action: h.action,
          by: h.by ? { _id: h.by._id, name: h.by.name } : null,
          comment: h.comment || null,
          timestamp: h.timestamp,
        })),
        createdAt: po.createdAt,
        updatedAt: po.updatedAt,
      }));

      res.status(200).json(formattedData);
    } catch (err) {
      console.error("Error fetching submitted POs:", err);
      res.status(500).json({ error: err.message });
    }
  }
);


// 📌 Get all POs approved or rejected by current approver
router.get(
  "/approver/processed",
  authenticateToken,
  roleCheck("APPROVER"),
  async (req, res) => {
    try {
      const approverId = req.user.userId;

      // Find all POs where the history contains APPROVED or REJECTED by this user
      const processedPOs = await PurchaseOrder.find({
        history: {
          $elemMatch: {
            by: approverId,
            action: { $in: ["APPROVED", "REJECTED"] }
          }
        }
      })
        .populate("createdBy", "name email")
        .populate("history.by", "name email")
        .sort({ updatedAt: -1 });

      // Format response for frontend
      const formattedData = processedPOs.map((po) => ({
        _id: po._id,
        title: po.title,
        description: po.description,
        amount: po.amount,
        status: po.status, // APPROVED or REJECTED
        createdBy: po.createdBy
          ? { _id: po.createdBy._id, name: po.createdBy.name }
          : null,
        history: po.history.map((h) => ({
          action: h.action,
          by: h.by ? { _id: h.by._id, name: h.by.name } : null,
          comment: h.comment || null,
          timestamp: h.timestamp,
        })),
        createdAt: po.createdAt,
        updatedAt: po.updatedAt,
      }));

      res.status(200).json(formattedData);
    } catch (err) {
      console.error("Error fetching processed POs:", err);
      res.status(500).json({ error: err.message });
    }
  }
);



module.exports = router;