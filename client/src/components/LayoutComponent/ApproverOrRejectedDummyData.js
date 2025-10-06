export const dummyPurchaseOrders = [
  {
    _id: "po1",
    title: "Office Chairs",
    description: "Purchase of ergonomic chairs",
    amount: 12000,
    status: "APPROVED",
    createdBy: { _id: "u1", name: "Alice Johnson" },
    approvedBy: { _id: "u2", name: "Manager Bob" },
    history: [
      {
        action: "CREATED",
        by: { _id: "u1", name: "Alice Johnson" },
        comment: "Requested chairs for new office",
        timestamp: new Date("2025-09-20T09:30:00")
      },
      {
        action: "SUBMITTED",
        by: { _id: "u1", name: "Alice Johnson" },
        timestamp: new Date("2025-09-20T10:00:00")
      },
      {
        action: "APPROVED",
        by: { _id: "u2", name: "Manager Bob" },
        comment: "Approved for immediate purchase",
        timestamp: new Date("2025-09-21T14:15:00")
      }
    ]
  },
  {
    _id: "po2",
    title: "Laptop Purchase",
    description: "High-performance laptops for dev team",
    amount: 350000,
    status: "REJECTED",
    createdBy: { _id: "u3", name: "Charlie Brown" },
    approvedBy: null,
    history: [
      {
        action: "CREATED",
        by: { _id: "u3", name: "Charlie Brown" },
        comment: "Requested laptops for development",
        timestamp: new Date("2025-09-18T11:00:00")
      },
      {
        action: "SUBMITTED",
        by: { _id: "u3", name: "Charlie Brown" },
        timestamp: new Date("2025-09-18T12:00:00")
      },
      {
        action: "REJECTED",
        by: { _id: "u2", name: "Manager Bob" },
        comment: "Budget constraints, not approved",
        timestamp: new Date("2025-09-19T15:45:00")
      }
    ]
  },
  {
    _id: "po3",
    title: "Printer Ink",
    description: "Bulk ink cartridges",
    amount: 2500,
    status: "APPROVED",
    createdBy: { _id: "u4", name: "David Smith" },
    approvedBy: { _id: "u2", name: "Manager Bob" },
    history: [
      {
        action: "CREATED",
        by: { _id: "u4", name: "David Smith" },
        timestamp: new Date("2025-09-15T09:00:00")
      },
      {
        action: "APPROVED",
        by: { _id: "u2", name: "Manager Bob" },
        comment: "Small purchase, approved quickly",
        timestamp: new Date("2025-09-15T10:30:00")
      }
    ]
  }
];