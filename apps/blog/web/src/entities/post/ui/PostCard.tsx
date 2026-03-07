import Link from "next/link";
import { type Post } from "#site/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";
import { formatDateYMD } from "@/shared/lib/utils";

export default function PostCard(post: Post) {
  return (
    <Card className="rounded-none border-0 border-b shadow-none">
      <Link href={post.url} className="transition-colors hover:text-point">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{post.title}</CardTitle>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDateYMD(post.date)}</time>
            {post.seriesTitle && (
              <span className="font-medium text-point">
                · {post.seriesTitle}
              </span>
            )}
          </div>
        </CardHeader>

        {post.tags && post.tags.length > 0 && (
          <CardContent className="pt-0">
            <ul className="flex flex-wrap gap-2" aria-label="태그">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Badge variant="secondary" className="font-medium">
                    #{tag}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
        {post.description && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{post.description}</p>
          </CardContent>
        )}
      </Link>
    </Card>
  );
}
