import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "invert";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-pure-white text-pure-black hover:bg-pure-black hover:text-pure-white",
  invert:
    "bg-pure-black text-pure-white hover:bg-pure-white hover:text-pure-black",
};

export function Button({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`text-label-sm cursor-pointer border border-pure-black px-sm py-xs ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
