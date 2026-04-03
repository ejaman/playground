import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  rightElement?: ReactNode;
};

export function Input({ rightElement, className = "", ...props }: InputProps) {
  return (
    <div className="flex items-center border border-pure-black px-sm py-xs">
      <input
        className={`text-mono-base w-full flex-1 bg-transparent text-pure-black outline-none placeholder:text-[rgb(0_0_0/0.35)] ${className}`}
        {...props}
      />
      {rightElement}
    </div>
  );
}
