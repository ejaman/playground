import { Container, Line } from "@/shared/ui";
import { profile } from "@/content";

const SOCIAL_KEYS = ["blog", "github"] as const;

export function Footer() {
  const activeLinks = SOCIAL_KEYS.filter((key) => profile.social[key] !== null);
  return (
    <footer>
      <Line />
      <Container>
        <div className="flex items-center justify-between py-sm">
          <p className="text-label-sm text-neutral-800/40">
            © 2026 {profile.brandName}. ALL RIGHTS RESERVED.
          </p>
          {activeLinks.length > 0 && (
            <nav aria-label="소셜 링크" className="flex items-center gap-md">
              {activeLinks.map((key) => (
                <a
                  key={key}
                  href={profile.social[key] ?? "#"}
                  aria-label={key}
                  className="text-label-sm hover:border-b hover:border-pure-black"
                >
                  {key.toUpperCase()}
                </a>
              ))}
            </nav>
          )}
        </div>
      </Container>
    </footer>
  );
}
