import { compareDesc, parseISO } from "date-fns";
import PostCard from "@/entities/post/ui/PostCard";
import { publishedPosts } from "@/entities/post/lib/posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts",
  description: "모든 게시글 목록입니다.",
};

export default function BlogPage() {
  const allPosts = publishedPosts.sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date)),
  );

  return (
    <div className="space-y-6">
      {allPosts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
