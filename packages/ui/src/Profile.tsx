import { Link, Mail } from "lucide-react";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { cn } from "./lib/utils";

export type SocialType = "github" | "email" | "link";

export interface SocialLink {
  type: SocialType;
  url: string;
}

export interface ProfileProps {
  name: string;
  image: string;
  description: string;
  socials?: SocialLink[];
  skills?: string[];
  className?: string;
}

const SOCIAL_ICONS: Record<
  SocialType,
  React.ComponentType<{ size?: number }>
> = {
  github: SiGithub,
  email: Mail,
  link: Link,
};

const SOCIAL_LABELS: Record<SocialType, string> = {
  github: "GitHub",
  email: "Email",
  link: "Blog",
};

export function Profile({
  name,
  image,
  description,
  socials = [],
  skills = [],
  className,
}: ProfileProps) {
  return (
    <div className={cn("rounded-2xl  bg-card/50 p-6", "flex gap-6", className)}>
      {/* 프로필 이미지 */}
      <div className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={`${name} 프로필 이미지`}
          width={96}
          height={96}
          className="size-24 border border-border/60 object-cover ring-2 ring-border/50 shadow-md rounded-full"
          style={{ borderRadius: "50%" }}
        />
      </div>

      <div className="flex flex-col min-w-0">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {name}
          </h2>
          <p className="mt-1.5 whitespace-pre-line text-m leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {/* 소셜 링크 */}
        {socials.length > 0 && (
          <div className="flex flex-wrap items-center sm:justify-start gap-2">
            {socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.type];
              const label = SOCIAL_LABELS[social.type];
              const href =
                social.type === "email" ? `mailto:${social.url}` : social.url;

              return (
                <a
                  key={`${social.type}-${social.url}`}
                  href={href}
                  target={social.type !== "email" ? "_blank" : undefined}
                  rel={
                    social.type !== "email" ? "noopener noreferrer" : undefined
                  }
                  aria-label={label}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium",
                    "text-muted-foreground transition-colors",
                    "hover:text-point",
                  )}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </a>
              );
            })}
          </div>
        )}

        {/* 기술 스택 */}
        {skills.length > 0 && (
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  "bg-muted/80 text-muted-foreground",
                  "border border-border/40",
                )}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
