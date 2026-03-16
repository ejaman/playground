import { notFound } from "next/navigation";
import { PostContent, publishedPosts } from "@/entities/post";
import { BASE_URL } from "@/shared/lib/constants";
import { parseHeadingsFromHtml } from "@/shared/lib/parseHeadingsFromHtml";
import { Metadata } from "next";

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

  const test: number = "test";

  if (!post) notFound();

  const headings = parseHeadingsFromHtml(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? post.title,
    datePublished: post.date,
    dateModified: post.date,
    url: `${BASE_URL}${post.url}`,
    author: {
      "@type": "Person",
      name: "이지민",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "이지민",
      url: BASE_URL,
    },
    keywords: post.tags?.join(", "),
    ...(post.thumbnail && { image: `${BASE_URL}${post.thumbnail}` }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {test}
      <PostContent
        title={post.title}
        date={post.date}
        tags={post.tags}
        series={post.series}
        html={post.body}
        headings={headings}
      />
    </>
  );
}
