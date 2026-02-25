import { allPosts, Post } from "contentlayer/generated"; // 생성된 폴더에서 데이터 임포트
import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns"; // 날짜 정렬용 (설치 필요: pnpm add date-fns)

export default function BlogPage() {
  // 최신순으로 글 정렬
  const posts = allPosts.sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date)),
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">나의 개발 실험실 🧪</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post._id} {...post} />
        ))}
      </div>
    </div>
  );
}

function PostCard(post: Post) {
  return (
    <article className="border-b pb-4">
      <Link
        href={post.url}
        className="text-xl font-semibold hover:text-blue-600"
      >
        {post.title}
      </Link>
      <div className="flex gap-2 mt-2 text-sm text-gray-500">
        <time dateTime={post.date}>
          {format(parseISO(post.date), "yyyy년 MM월 dd일")}
        </time>
        {post.seriesTitle && (
          <span className="text-blue-500 font-medium">
            · {post.seriesTitle}
          </span>
        )}
      </div>
    </article>
  );
}
