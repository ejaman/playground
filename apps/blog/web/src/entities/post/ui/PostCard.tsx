import React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Post } from "contentlayer/generated";

export default function PostCard(post: Post) {
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
