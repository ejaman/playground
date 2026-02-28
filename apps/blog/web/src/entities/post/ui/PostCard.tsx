import React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { type Post } from "#site/content";

export default function PostCard(post: Post) {
  return (
    <article className="border-b pb-4">
      <Link
        href={post.url}
        className="text-xl font-semibold hover:text-blue-600"
      >
        {post.title}
      </Link>
      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
        <time dateTime={post.date}>
          {format(parseISO(post.date), "yyyy년 MM월 dd일")}
        </time>
        {post.seriesTitle && (
          <span className="text-blue-500 font-medium">
            · {post.seriesTitle}
          </span>
        )}
      </div>
      {post.tags && post.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-2" aria-label="태그">
          {post.tags.map((tag) => (
            <li key={tag}>
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
