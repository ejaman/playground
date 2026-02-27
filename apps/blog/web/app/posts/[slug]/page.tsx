import { posts } from "#site/content";
import { notFound } from "next/navigation";
import PostContent from "../../../src/entities/post/ui/PostContent";
import { parseHeadingsFromHtml } from "../../../src/shared/lib/parseHeadingsFromHtml";

export const generateStaticParams = async () =>
  posts.map((post) => ({ slug: post.id }));

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.id === slug);

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
