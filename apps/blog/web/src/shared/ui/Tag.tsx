import { Badge } from "@/shared/ui/Badge";

interface TagProps {
  label: string;
}

export const Tag = ({ label }: TagProps) => (
  <Badge variant="secondary" className="font-medium">
    #{label}
  </Badge>
);
