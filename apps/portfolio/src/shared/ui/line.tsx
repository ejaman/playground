type LineProps = {
  className?: string;
};

export function Line({ className = "" }: LineProps) {
  return (
    <div role="separator" className={`h-px w-full bg-black/10 ${className}`} />
  );
}
