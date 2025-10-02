const testPurchaseOrders = [
  {
    id: "1",
    title: "Office Chairs",
    description: "Purchase of ergonomic chairs for staff",
    amount: 50000,
    createdBy: "Alice Johnson",
    status: "SUBMITTED",
    createdAt: "2025-09-28T10:30:00Z",
    history: [
      { action: "CREATED", by: "Alice Johnson", comment: "Initial request", timestamp: "2025-09-28T10:30:00Z" },
      { action: "SUBMITTED", by: "Alice Johnson", comment: "Submitted for approval", timestamp: "2025-09-28T11:00:00Z" }
    ]
  },
  {
    id: "2",
    title: "Laptops",
    description: "New laptops for development team",
    amount: 200000,
    createdBy: "Bob Smith",
    status: "APPROVED",
    createdAt: "2025-09-25T14:00:00Z",
    history: [
      { action: "CREATED", by: "Bob Smith", comment: "Added laptop request", timestamp: "2025-09-25T14:00:00Z" },
      { action: "SUBMITTED", by: "Bob Smith", comment: "Submitted for review", timestamp: "2025-09-25T14:30:00Z" },
      { action: "APPROVED", by: "Manager John", comment: "Approved budget", timestamp: "2025-09-26T09:00:00Z" }
    ]
  },
  {
    id: "3",
    title: "Stationery",
    description: "Notebooks, pens, markers",
    amount: 8000,
    createdBy: "Charlie Davis",
    status: "REJECTED",
    createdAt: "2025-09-20T09:15:00Z",
    history: [
      { action: "CREATED", by: "Charlie Davis", comment: "Requested office supplies", timestamp: "2025-09-20T09:15:00Z" },
      { action: "SUBMITTED", by: "Charlie Davis", comment: "Submitted for approval", timestamp: "2025-09-20T10:00:00Z" },
      { action: "REJECTED", by: "Manager Lisa", comment: "Exceeded department budget", timestamp: "2025-09-21T08:30:00Z" }
    ]
  },
  {
    id: "4",
    title: "Team Lunch",
    description: "Quarterly celebration lunch",
    amount: 12000,
    createdBy: "David Wilson",
    status: "APPROVED",
    createdAt: "2025-09-18T16:45:00Z",
    history: [
      { action: "CREATED", by: "David Wilson", comment: "Planned team lunch", timestamp: "2025-09-18T16:45:00Z" },
      { action: "SUBMITTED", by: "David Wilson", comment: "Sent for approval", timestamp: "2025-09-18T17:00:00Z" },
      { action: "APPROVED", by: "Manager Sarah", comment: "Approved expense", timestamp: "2025-09-19T09:00:00Z" }
    ]
  }
];

// Generate 21 more records dynamically for pagination test
for (let i = 5; i <= 25; i++) {
  testPurchaseOrders.push({
    id: String(i),
    title: `Test Order ${i}`,
    description: i % 2 === 0 ? "Bulk office supplies" : "Team building event",
    amount: Math.floor(Math.random() * 100000) + 5000,
    createdBy: i % 3 === 0 ? "Alice Johnson" : i % 3 === 1 ? "Bob Smith" : "Charlie Davis",
    status: i % 4 === 0 ? "APPROVED" : i % 4 === 1 ? "REJECTED" : i % 4 === 2 ? "SUBMITTED" : "DRAFT",
    createdAt: new Date(2025, 8, i).toISOString(), // spread across September 2025
    history: [
      { action: "CREATED", by: "System", comment: "Auto-generated test data", timestamp: new Date(2025, 8, i, 9).toISOString() },
      { action: "SUBMITTED", by: "System", comment: "Sent for approval", timestamp: new Date(2025, 8, i, 12).toISOString() }
    ]
  });
}

export default testPurchaseOrders;
