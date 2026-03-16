import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PostCard from "./PostCard";
import { formatDateYMD } from "@/shared/lib/utils";

describe("PostCard", () => {
  const basePost = {
    url: "/posts/test-post",
    title: "테스트 포스트",
    date: "2024-01-01",
    tags: ["tag1", "tag2"],
    seriesTitle: "시리즈 제목",
    description: "포스트 설명",
  } as any;

  it("제목과 링크를 렌더링한다", () => {
    render(<PostCard {...basePost} />);

    const title = screen.getByText(basePost.title);
    expect(title).toBeInTheDocument();

    const link = title.closest("a");
    expect(link).toHaveAttribute("href", basePost.url);
  });

  it("날짜를 포맷해서 렌더링한다", () => {
    render(<PostCard {...basePost} />);

    const formatted = formatDateYMD(basePost.date);
    const timeEl = screen.getByText(formatted);
    expect(timeEl).toBeInTheDocument();
    expect(timeEl.tagName.toLowerCase()).toBe("time");
  });

  it("시리즈 제목이 있을 때만 렌더링한다", () => {
    const { rerender } = render(<PostCard {...basePost} />);

    expect(screen.getByText(`· ${basePost.seriesTitle}`)).toBeInTheDocument();

    rerender(<PostCard {...{ ...basePost, seriesTitle: undefined }} />);
    expect(
      screen.queryByText(`· ${basePost.seriesTitle}`),
    ).not.toBeInTheDocument();
  });

  it("태그 목록을 올바르게 렌더링한다", () => {
    const { rerender } = render(<PostCard {...basePost} />);

    expect(screen.getByRole("list", { name: "태그" })).toBeInTheDocument();
    basePost.tags.forEach((tag: string) => {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
    });

    rerender(<PostCard {...{ ...basePost, tags: [] }} />);
    expect(
      screen.queryByRole("list", { name: "태그" }),
    ).not.toBeInTheDocument();
  });

  it("description 이 있을 때만 렌더링한다", () => {
    const { rerender } = render(<PostCard {...basePost} />);

    expect(screen.getByText(basePost.description)).toBeInTheDocument();

    rerender(<PostCard {...{ ...basePost, description: undefined }} />);
    expect(screen.queryByText(basePost.description)).not.toBeInTheDocument();
  });
});
