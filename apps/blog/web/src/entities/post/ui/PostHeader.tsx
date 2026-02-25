import { Tag } from "../../../shared/ui/Tag";

interface PostHeaderProps {
  title: string;
  date: string;
  tags?: string[];
}

export const PostHeader = ({ title, date, tags }: PostHeaderProps) => (
  <header className="mb-12 border-b border-border pb-8 font-sans">
    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
      {title}
    </h1>

    {tags && tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    )}

    <div className="flex items-center text-sm text-muted-foreground">
      <time dateTime={date}>{date}</time>
    </div>
  </header>
);
