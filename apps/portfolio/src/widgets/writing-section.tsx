import { Line } from "@/shared/ui";
import { articles } from "@/content";

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="3"
        y1="9"
        x2="15"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 4L15 9L10 14"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

export function WritingSection() {
  return (
    <div>
      <p className="text-label-sm mb-md">
        <span className="md:hidden">JOURNAL</span>
      </p>
      <Line />
      <ul>
        {articles.map(({ date, title, description, link }) => (
          <li key={title}>
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="[margin-inline:-24px] flex items-center justify-between px-sm py-md hover:bg-neutral-100"
              >
                <ArticleContent date={date} title={title} description={description} />
                <span className="ml-sm shrink-0">
                  <ArrowRight />
                </span>
              </a>
            ) : (
              <div className="[margin-inline:-24px] flex items-center justify-between px-sm py-md">
                <ArticleContent date={date} title={title} description={description} />
              </div>
            )}
            <Line />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArticleContent({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-label-sm mb-xs text-neutral-800/40">{date}</p>
      <h3 className="text-body-intro mb-xs">{title}</h3>
      <p className="text-body-base text-neutral-800/60">{description}</p>
    </div>
  );
}
