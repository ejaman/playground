import Link from "next/link";
import { compareDesc, parseISO } from "date-fns";
import { type Post } from "#site/content";
import { formatDateYMD } from "@/shared/lib";
import { Tag } from "@/shared/ui";

interface SerieCardProps {
  seriesKey: string;
  title: string;
  description?: string;
  posts: Post[];
}

export function SerieCard({ title, description, posts }: SerieCardProps) {
  const topPosts = [...posts]
    .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))
    .slice(0, 3);

  return (
    <details
      className="border border-border/70 shadow-xs px-5 py-4 sm:rounded-xl"
      open
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div>
          <div className="flex flex-row items-center between gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-foreground">
              🤾 {title}
            </h2>
            <p className="mt-0.5 text-sx text-muted-foreground">
              총 {posts.length} 편
            </p>
          </div>

          <p className="mt-0.5 text-sm text-foreground">{description}</p>
        </div>
        <span className="text-xs text-muted-foreground transition-transform group-open:-rotate-180">
          ▼
        </span>
      </summary>

      <div className="mt-3 space-y-2">
        {topPosts.map((post) => (
          <article
            key={post.id}
            className="rounded-lg bg-background px-3 py-2 shadow-xs"
          >
            <div className="flex flex-row items-center between gap-2">
              <Link
                href={post.url}
                className="text-md font-medium text-foreground hover:text-point hover:underline"
              >
                {post.title}
              </Link>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDateYMD(post.date)}
              </p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5 py-1">
                {post.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
            )}
            {post.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {post.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </details>
  );
}
