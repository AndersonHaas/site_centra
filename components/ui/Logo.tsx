import Image from "next/image";
import { cn } from "@/lib/utils";
import logoImg from "@/media/logo.png";

export function LogoMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logoImg}
      alt="Logo Centra"
      className={cn("h-8 w-auto", className)}
      priority={priority}
    />
  );
}

export function Logo({
  className,
  dark = true,
  priority = false,
}: {
  className?: string;
  dark?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark priority={priority} />
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
          ENGENHARIA · EMPREENDIMENTOS
        </span>
      </span>
    </span>
  );
}
