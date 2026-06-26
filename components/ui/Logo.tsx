import Image from "next/image";
import { cn } from "@/lib/utils";
import logoImg from "@/media/logo.png";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={logoImg}
      alt="Logo Centra"
      className={cn("h-8 w-auto", className)}
      priority
    />
  );
}

export function Logo({
  className,
  dark = true,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
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
            dark ? "text-white/45" : "text-ink-faint",
          )}
        >
          ENGENHARIA · EMPREENDIMENTOS
        </span>
      </span>
    </span>
  );
}
