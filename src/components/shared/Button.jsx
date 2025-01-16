import React from "react";

const Button = ({ 
  type = "button", 
  onClick, 
  children, 
  className = "", 
  isLoading = false, 
  disabled = false, 
  variant = "primary" 
}) => {
  const baseStyles = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    outline: "bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-100",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";
  const loadingStyles = "flex items-center justify-center space-x-2";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${
        disabled || isLoading ? disabledStyles : ""
      } ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className={loadingStyles}>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V4z"
            ></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;