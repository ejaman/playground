import { compareDesc, parseISO } from "date-fns";
import { publishedPosts } from "@/entities/post";
import {
  getSeriesListFromJson,
  SerieCard,
} from "@/entities/series";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Series",
  description: "시리즈 목록입니다.",
};

export default function SeriesPage() {
  const seriesFromJson = getSeriesListFromJson();

  const seriesWithPosts = seriesFromJson
    .map((item) => ({
      key: item.key,
      title: item.title,
      description: item.description,
      posts: publishedPosts.filter((p) => p.series === item.key),
    }))
    .filter((s) => s.posts.length > 0);

  const seriesList = [...seriesWithPosts].sort((a, b) => {
    const aLatest = a.posts.reduce(
      (max, p) => (p.date > max ? p.date : max),
      "",
    );
    const bLatest = b.posts.reduce(
      (max, p) => (p.date > max ? p.date : max),
      "",
    );
    return compareDesc(parseISO(aLatest), parseISO(bLatest));
  });

  return (
    <div className="space-y-5">
      {seriesList.map((series) => (
        <SerieCard
          key={series.key}
          seriesKey={series.key}
          title={series.title}
          description={series.description}
          posts={series.posts}
        />
      ))}
    </div>
  );
}
