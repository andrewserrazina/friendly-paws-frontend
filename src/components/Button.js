import React from "react";

const Button = ({ children, onClick, variant }) => {
  const buttonStyle =
    variant === "destructive"
      ? "bg-red-500 text-white px-4 py-2 rounded"
      : "bg-blue-500 text-white px-4 py-2 rounded";

  return (
    <button onClick={onClick} className={buttonStyle}>
      {children}
    </button>
  );
};

export default Button;