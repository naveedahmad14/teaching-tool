export default function GameButton({ 
  children, 
  onClick, 
  disabled = false, 
  variant = "primary",
  type = "button",
  className = "",
  ...props 
}) {
  const baseClasses = "game-button";
  const variantClasses = {
    primary: "bg-gradient-to-br from-[#625EC6] to-[#4A46A8] border-[#625EC6]",
    gold: "bg-gradient-to-br from-[#FFD700] to-[#D4AF37] border-[#FFD700] text-[#1A1A2E]",
    danger: "bg-gradient-to-br from-[#F44336] to-[#D32F2F] border-[#F44336]",
    success: "bg-gradient-to-br from-[#4CAF50] to-[#388E3C] border-[#4CAF50]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
