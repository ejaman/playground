import { Post } from "contentlayer/generated";
import { ReactNode } from "react";
import { PostBody } from "./PostBody";
import { PostHeader } from "./PostHeader";

type PostContentProps = Pick<Post, "title" | "date" | "tags" | "series"> & {
  html: string;
};

export default function PostContent({
  title,
  date,
  tags,
  series,
  html,
}: PostContentProps) {
  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-12">
      <PostHeader title={title} date={date} tags={tags} />
      <PostBody html={html} />
    </article>
  );
}
