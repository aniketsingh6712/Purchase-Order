import React from "react";

const StatusLegend = () => {
  const legendItems = [
    { status: "APPROVED", color: "text-green-600", bg: "bg-green-100" },
    { status: "REJECTED", color: "text-red-600", bg: "bg-red-100" },
    { status: "SUBMITTED", color: "text-blue-600", bg: "bg-blue-100" },
    { status: "DRAFT", color: "text-gray-600", bg: "bg-gray-200" },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {legendItems.map((item) => (
        <div
          key={item.status}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <span className={`w-4 h-4 rounded-full ${item.bg} border`} />
          <span className={item.color}>{item.status}</span>
        </div>
      ))}
    </div>
  );
};

export default StatusLegend;
