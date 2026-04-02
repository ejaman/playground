import React, { type ReactNode } from "react";

/** **bold**, `code`, [text](url), - list, \n 을 지원하는 경량 마크다운 렌더러 */

function parseInline(text: string): ReactNode[] {
  const result: ReactNode[] = [];
  // **bold** | `code` | [text](url)
  const pattern = /\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      result.push(text.slice(last, match.index));
    }
    if (match[1] !== undefined) {
      result.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      result.push(
        <code
          key={match.index}
          className='font-mono text-[0.9em]'
        >
          {match[2]}
        </code>,
      );
    } else if (match[3] !== undefined && match[4] !== undefined) {
      result.push(
        <a
          key={match.index}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-current pb-0.5"
        >
          {match[3]}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    result.push(text.slice(last));
  }

  return result;
}

export function Markdown({ children }: { children: string }) {
  const lines = children.split("\n");
  const nodes: ReactNode[] = [];
  let listItems: ReactNode[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={key++} className="mb-sm list-none space-y-1">
          {listItems}
        </ul>,
      );
      listItems = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trimStart();

    if (trimmed.startsWith("## ")) {
      flushList();
      while (nodes.length > 0 && (nodes[nodes.length - 1] as React.ReactElement)?.type === "br") {
        nodes.pop();
      }
      nodes.push(
        <p key={key++} className="mt-sm mb-xs text-label-sm uppercase tracking-widest text-neutral-800/40">
          {trimmed.slice(3)}
        </p>,
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(
        <li key={key++} className="flex gap-xs">
          <span className="select-none text-neutral-800/40">—</span>
          <span>{parseInline(trimmed.slice(2))}</span>
        </li>,
      );
    } else {
      flushList();
      if (trimmed === "") {
        nodes.push(<br key={key++} />);
      } else {
        nodes.push(<p key={key++} className="mb-xs">{parseInline(trimmed)}</p>);
      }
    }
  }

  flushList();

  return <div className="text-body-base">{nodes}</div>;
}
