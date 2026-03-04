import { compareDesc, parseISO } from "date-fns";
import PostCard from "@/entities/post/ui/PostCard";
import { publishedPosts } from "@/entities/post/lib/posts";
import { Profile } from "@repo/ui";

export default function BlogPage() {
  const allPosts = publishedPosts.sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date)),
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Profile
        image="/images/jellyfish.webp"
        description="안녕하세요. 이지민입니다."
        socials={[
          { type: "github", url: "https://github.com/jellyfish" },
          { type: "link", url: "https://jellyfish.example.com" },
        ]}
      />

      <div className="space-y-6">
        {allPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
