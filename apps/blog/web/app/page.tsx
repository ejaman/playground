import { posts } from "#site/content"; // 생성된 폴더에서 데이터 임포트
import { compareDesc, parseISO } from "date-fns"; // 날짜 정렬용 (설치 필요: pnpm add date-fns)
import PostCard from "../src/entities/post/ui/PostCard";

export default function BlogPage() {
  // 최신순으로 글 정렬
  const allPosts = posts.sort((a, b) =>
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
