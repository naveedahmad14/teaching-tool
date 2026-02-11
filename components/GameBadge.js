export default function GameBadge({ 
  children, 
  variant = "default",
  className = "",
  ...props 
}) {
  const variantClasses = {
    default: "bg-[#625EC6] border-[#FFD700]",
    gold: "bg-[#FFD700] border-[#FFD700] text-[#1A1A2E]",
    success: "bg-[#4CAF50] border-[#4CAF50]",
    danger: "bg-[#F44336] border-[#F44336]",
    info: "bg-[#2196F3] border-[#2196F3]",
  };

  return (
    <span
      className={`game-badge ${variantClasses[variant]} ${className}`}
      role="status"
      {...props}
    >
      {children}
    </span>
  );
}


