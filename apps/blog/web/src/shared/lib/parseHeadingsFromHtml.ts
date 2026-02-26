/**
 * HTML 문자열에서 rehype-slug가 부여한 id를 가진 h1~h6 제목들을 추출합니다.
 * 목차(ToC) 생성에 사용합니다.
 */
export type HeadingItem = {
  id: string;
  text: string;
  level: number; // 1~6
};

const HEADING_REGEX = /<h([1-6])[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

export function parseHeadingsFromHtml(html: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  let match: RegExpExecArray | null;

  const re = new RegExp(HEADING_REGEX.source, "gi");
  while ((match = re.exec(html)) !== null) {
    const level = Number(match[1]) as 1 | 2 | 3 | 4 | 5 | 6;
    const id = match[2];
    const rawContent = match[3];
    if (!rawContent) continue;
    const text = stripHtml(rawContent);
    if (id && text) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}
