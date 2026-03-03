// 단순한 디자인 조각입니다.
interface TagProps {
  label: string;
}

export const Tag = ({ label }: TagProps) => (
  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-secondary transition-colors">
    #{label}
  </span>
);
