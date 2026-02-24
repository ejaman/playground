// apps/blog/web/app/posts/[slug]/page.tsx
import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";

// 1. 빌드 시 각 포스트의 경로를 미리 생성합니다.
export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

// 2. 반드시 'export default'가 있어야 에러가 나지 않습니다!
export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p._raw.flattenedPath === params.slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <time className="text-gray-500">{post.date}</time>
      <div
        className="mt-8"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </article>
  );
}
