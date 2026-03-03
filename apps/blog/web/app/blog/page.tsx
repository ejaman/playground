import { compareDesc, parseISO } from "date-fns";
import PostCard from "@/entities/post/ui/PostCard";
import { publishedPosts } from "@/entities/post/lib/posts";

export default function BlogPage() {
  const allPosts = publishedPosts.sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date)),
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">🐾 개발 실험실</h1>

      <div className="space-y-6">
        {allPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
