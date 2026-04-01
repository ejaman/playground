type LineProps = {
  className?: string;
};

export function Line({ className = "" }: LineProps) {
  return (
    <hr
      className={`border-none border-t border-t-[rgb(0_0_0/0.1)] ${className}`}
    />
  );
}
