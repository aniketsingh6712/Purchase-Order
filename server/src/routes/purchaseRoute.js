const express = require("express");
const router = express.Router();
const PurchaseOrder = require("../models/purchaseRecord");
const { authenticateToken, roleCheck } = require("../middleware/auth");

//draft Pos
router.post("/po", authenticateToken,roleCheck(["APPROVER", "CREATOR"]), async (req, res) => {
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

// Delete Drafted Pos
router.delete(
  "/po/:id/delete",
  authenticateToken,
  roleCheck(["APPROVER", "CREATOR"]),

  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Find the PO
      const po = await PurchaseOrder.findById(id);
      if (!po) {
        return res.status(404).json({ error: "Purchase order not found" });
      }

      // Ensure only the creator can delete their draft
      if (po.createdBy.toString() !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this PO" });
      }

      // Allow deletion only if it's in DRAFT state
      if (po.status !== "DRAFT") {
        return res.status(400).json({ error: "Only draft POs can be deleted" });
      }

      await po.deleteOne();

      return res.json({ message: "Purchase order deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

//  Submit PO (Creator only)
router.put("/po/:id/submit", authenticateToken, roleCheck(["APPROVER", "CREATOR"]), async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "PO not found" });

    if (po.status !== "DRAFT") {
      return res.status(400).json({ error: "Only draft POs can be submitted" });
    }

    po.status = "SUBMITTED";
    
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

//Approve PO (Approver only)
router.put("/po/:id/approve", authenticateToken, roleCheck(["APPROVER"]), async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "PO not found" });

    if (po.status !== "SUBMITTED") {
      return res.status(400).json({ error: "Only submitted POs can be approved" });
    }

    po.status = "APPROVED";
    po.history.push({
      action: "APPROVED",
      by: {_id:req.user.userId,
        username:req.user.username},
      
      comment: req.body.comment,
      timestamp: new Date()
    });

    await po.save();
    res.json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Reject PO (Approver only)
router.put("/po/:id/reject", authenticateToken, roleCheck(["APPROVER"]), async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) return res.status(404).json({ error: "PO not found" });

    if (po.status !== "SUBMITTED") {
      return res.status(400).json({ error: "Only submitted POs can be rejected" });
    }

    po.status = "REJECTED";
    po.history.push({
      action: "REJECTED",
      by: {_id:req.user.userId,
        username:req.user.username},
      comment: req.body.comment,
      timestamp: new Date()
    });

    await po.save();
    res.json(po);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// /api/po/my?status=DRAFT or status=SUBMITTED  for creator
router.get("/my", authenticateToken,roleCheck(["APPROVER", "CREATOR"]), async (req, res) => {
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




//Approved or rejected Pos created By user
router.get("/my/completed", authenticateToken, roleCheck(["APPROVER", "CREATOR"]),async (req, res) => {
  try {
    const completedPOs = await PurchaseOrder.find({
      createdBy: req.user.userId,
      status: { $in: ["APPROVED", "REJECTED"] }
    })
      .populate("createdBy", "username email")   
      .populate("history.by", "username email")  
      .sort({ createdAt: -1 });

   
    const formattedPOs = completedPOs.map(po => ({
      _id: po._id,
      title: po.title,
      description: po.description,
      amount: po.amount,
      status: po.status,
      createdBy: po.createdBy
        ? { _id: po.createdBy._id, username: po.createdBy.username }
        : null,
      
      history: po.history
        ? po.history.map(h => ({
            action: h.action,
            by: h.by
              ? { _id: h.by._id, username: h.by.username }
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


//Submitted POs for Approver
router.get(
  "/approver/submitted",
  authenticateToken,
  roleCheck(["APPROVER"]),
  async (req, res) => {
    try {
      
       const submittedPOs = await PurchaseOrder.find({
        status: "SUBMITTED",
        createdBy: { $ne: req.user.userId }, // exclude POs created by current user
      })
        .populate("createdBy", "username email")
        .populate("history.by", "username email")
        .sort({ createdAt: -1 });

      const formattedData = submittedPOs.map((po) => ({
        _id: po._id,
        title: po.title,
        description: po.description,
        amount: po.amount,
        status: po.status,
       createdBy: po.createdBy
          ? { _id: po.createdBy._id, username: po.createdBy.username }
          : null,
        history: po.history.map((h) => ({
          action: h.action,
          by: h.by ? { _id: h.by._id, username: h.by.username } : null,
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


// all POs approved or rejected by current approver
router.get(
  "/approver/processed",
  authenticateToken,
  roleCheck(["APPROVER"]),
  async (req, res) => {
    try {
      const approverId = req.user.userId;

      
      const processedPOs = await PurchaseOrder.find({
        history: {
          $elemMatch: {
            by: approverId,
            action: { $in: ["APPROVED", "REJECTED"] }
          }
        }
      })
        .populate("createdBy", "username email")
        .populate("history.by", "username email")
        .sort({ updatedAt: -1 });

      
      const formattedData = processedPOs.map((po) => ({
        _id: po._id,
        title: po.title,
        description: po.description,
        amount: po.amount,
        status: po.status, 
        createdBy: po.createdBy
          ? { _id: po.createdBy._id, username: po.createdBy.username }
          : null,
        history: po.history.map((h) => ({
          action: h.action,
          by: h.by ? { _id: h.by._id, username: h.by.username } : null,
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

// All the Pos created by user So far
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const pos = await PurchaseOrder.find({ createdBy: userId })
      .populate("createdBy", "username email")
      .populate("history.by", "username email")
      .sort({ createdAt: -1 });

  
    const formattedList = pos.map(po => ({
      id: po._id.toString(),
      title: po.title,
      description: po.description,
      amount: po.amount,
      createdBy: po.createdBy?.username || "Unknown",
      status: po.status,
      createdAt: po.createdAt,
      history: po.history.map(h => ({
        action: h.action,
        by: h.by?.username || "Unknown",
        comment: h.comment,
        timestamp: h.timestamp
      }))
    }));

    res.status(200).json(formattedList);
  } catch (err) {
    console.error("Error fetching user purchase orders:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});


module.exports = router;