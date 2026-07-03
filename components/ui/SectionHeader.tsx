"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  /* Revela o título linha a linha (SplitText) em vez do Reveal padrão */
  split?: boolean;
};

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
  className,
  as: Heading = "h2",
  split = false,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Reveal>
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span
            className={cn(
              "eyebrow",
              dark ? "text-brand-300" : "text-brand-600",
            )}
          >
            {index}
          </span>
          <span
            className={cn(
              "h-px w-8",
              dark ? "bg-white/20" : "bg-hair",
            )}
          />
          <span
            className={cn(
              "eyebrow",
              dark ? "text-white/55" : "text-ink-soft",
            )}
          >
            {eyebrow}
          </span>
        </div>
      </Reveal>

      {split ? (
        <SplitText
          as={Heading}
          per="line"
          delay={0.06}
          className={cn(
            "display mt-5 text-balance text-3xl sm:text-4xl md:text-[2.9rem]",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </SplitText>
      ) : (
        <Reveal delay={0.06}>
          <Heading
            className={cn(
              "display mt-5 text-balance text-3xl sm:text-4xl md:text-[2.9rem]",
              dark ? "text-white" : "text-ink",
            )}
          >
            {title}
          </Heading>
        </Reveal>
      )}

      {description && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed sm:text-lg",
              dark ? "text-white/65" : "text-ink-soft",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
