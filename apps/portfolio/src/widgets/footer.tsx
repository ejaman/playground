import { Container, Line } from "@/shared/ui";

const SOCIAL_LINKS = ["INSTAGRAM", "TWITTER", "LINKEDIN"] as const;

export function Footer() {
  return (
    <footer>
      <Line />
      <Container>
        <div className="flex items-center justify-between py-sm">
          <p className="text-label-sm text-neutral-800/40">
            © 2024 THE DIGITAL CURATOR. ALL RIGHTS RESERVED.
          </p>
          <nav aria-label="소셜 링크" className="flex items-center gap-md">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                aria-label={link}
                className="text-label-sm hover:border-b hover:border-pure-black"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
