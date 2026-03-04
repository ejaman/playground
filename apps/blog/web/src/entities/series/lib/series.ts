import path from "path";
import fs from "fs";

export type SeriesItem = {
  key: string;
  title: string;
  description?: string;
};

/** apps/blog/series.json 경로 (web 앱 기준 상위 디렉터리) */
const SERIES_JSON_PATH = path.join(process.cwd(), "..", "series.json");

function readSeriesJson(): Record<string, { title: string; description?: string }> {
  if (!fs.existsSync(SERIES_JSON_PATH)) {
    return {};
  }
  const raw = fs.readFileSync(SERIES_JSON_PATH, "utf-8");
  return JSON.parse(raw) as Record<string, { title: string; description?: string }>;
}

/**
 * series.json에 정의된 키·제목·설명 목록을 반환합니다.
 * (실제 포스트 수는 페이지에서 publishedPosts와 매칭해 사용)
 */
export function getSeriesListFromJson(): SeriesItem[] {
  const data = readSeriesJson();
  return Object.entries(data).map(([key, value]) => ({
    key,
    title: value.title ?? key,
    description: value.description,
  }));
}
