import React from "react";

const ExpenseForm = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-center gap-2 text-xl font-semibold mb-2">
        <span>Expense Tracker</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Title */}
        <div>
          <label className="input-label-style">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="e.g. office supply"
            required
            className="w-full border rounded-md p-2 mt-1"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="input-label-style">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={onChange}
            placeholder="e.g. 1200"
            required
            min={1}
            className="w-full border rounded-md p-2 mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <label className="input-label-style">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="e.g. Bought chairs,pens etc."
            rows={3}
            required
            className="w-full border rounded-md p-2 mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;

