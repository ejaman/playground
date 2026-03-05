import { notFound } from "next/navigation";
import PostContent from "@/entities/post/ui/PostContent";
import { parseHeadingsFromHtml } from "@/shared/lib/parseHeadingsFromHtml";
import { publishedPosts } from "@/entities/post/lib/posts";
import { Metadata } from "next";
import { BASE_URL } from "@/shared/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

// 동적 metadata 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = publishedPosts.find((p) => p.id === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: "description",
    openGraph: {
      title: post.title,
      description: "description",
      url: `${BASE_URL}${post.url}`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: "description",
    },
  };
}

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
