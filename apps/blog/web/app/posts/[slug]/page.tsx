import { notFound } from "next/navigation";
import PostContent from "../../../src/entities/post/ui/PostContent";
import { parseHeadingsFromHtml } from "../../../src/shared/lib/parseHeadingsFromHtml";
import { publishedPosts } from "../../../src/entities/post/lib/posts";

export const generateStaticParams = async () =>
  publishedPosts.map((post) => ({ slug: post.id }));

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = publishedPosts.find((p) => p.id === slug);

  if (!post) notFound();

  const headings = parseHeadingsFromHtml(post.body);

  return (
    <PostContent
      title={post.title}
      date={post.date}
      tags={post.tags}
      series={post.series}
      html={post.body}
      headings={headings}
    />
  );
}
