import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import logoImg from "@/media/logo.png";
import logoPyImg from "@/media/logo-py-mark.png";
import type { Market } from "@/lib/group/market";

export function LogoMark({
  market,
  className,
  alt = "",
  priority = false,
}: {
  market: Market;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={market === "py" ? logoPyImg : logoImg}
      alt={alt}
      className={cn("h-8 w-auto", className)}
      priority={priority}
    />
  );
}

export function Logo({
  market,
  className,
  dark = true,
  priority = false,
}: {
  market: Market;
  className?: string;
  dark?: boolean;
  priority?: boolean;
}) {
  const t = useTranslations("brand");

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark
        market={market}
        priority={priority}
        alt={t("symbolAlt")}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.15rem] font-semibold tracking-[0.14em]",
            dark ? "text-white" : "text-ink",
          )}
        >
          CENTRA
        </span>
        <span
          className={cn(
            "mt-1 font-mono text-[0.5rem] tracking-[0.22em]",
            dark ? "text-white/55" : "text-ink-soft",
          )}
        >
          {t(market === "py" ? "pySubtitle" : "brSubtitle")}
        </span>
      </span>
    </span>
  );
}
