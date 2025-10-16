import React from "react";
import { FaRegSmile } from "react-icons/fa"; // default icon

const EmptyDataPrompt = ({ 
  message = "No data available", 
  icon: Icon = FaRegSmile, 
  children 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-blue-600 py-10 px-4">
      <Icon className="text-5xl mb-4 animate-bounce" />
      <p className="text-lg text-center font-semibold">{message}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default EmptyDataPrompt;
