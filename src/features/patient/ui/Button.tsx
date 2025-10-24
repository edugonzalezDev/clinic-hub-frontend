interface ButtonProps {
  text: string;
  variant?: "solid" | "outline";
  onClick?: () => void;
}

export const Button = ({ text, variant = "solid", onClick }: ButtonProps) => {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200";
  const styles =
    variant === "solid"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-blue-600 text-blue-600 hover:bg-blue-50";

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {text}
    </button>
  );
};
