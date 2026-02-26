import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import PostContent from "../../../src/entities/post/ui/PostContent";
import { parseHeadingsFromHtml } from "../../../src/shared/lib/parseHeadingsFromHtml";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p._raw.flattenedPath === slug);

  if (!post) notFound();

  const headings = parseHeadingsFromHtml(post.body.html);

  return (
    <PostContent
      title={post.title}
      date={post.date}
      tags={post.tags}
      series={post.series}
      html={post.body.html}
      headings={headings}
    />
  );
}
