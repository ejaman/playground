import { Post } from "contentlayer/generated";
import type { HeadingItem } from "../../../shared/lib/parseHeadingsFromHtml";
import { PostBody } from "./PostBody";
import { PostHeader } from "./PostHeader";
import { TableOfContents } from "./TableOfContents";

type PostContentProps = Pick<Post, "title" | "date" | "tags" | "series"> & {
  html: string;
  headings: HeadingItem[];
};

export default function PostContent({
  title,
  date,
  tags,
  series,
  html,
  headings,
}: PostContentProps) {
  return (
    <div className="relative px-6 py-6 xl:py-12">
      {/* 좁은 화면: 목차 상단 배치, 스크롤 시 상단 고정(sticky) */}
      <div className="mx-auto mb-8 w-full xl:hidden sticky top-0 z-10">
        <TableOfContents
          title={title}
          headings={headings}
          variant="sticky-top"
        />
      </div>

      <article className="mx-auto w-full max-w-5xl xl:pr-35 xl:pl-15">
        <PostHeader title={title} date={date} tags={tags} />
        <PostBody html={html} />
      </article>

      {/* 넓은 화면: 목차 우측 고정 */}
      <TableOfContents headings={headings} variant="fixed-right" />
    </div>
  );
}
