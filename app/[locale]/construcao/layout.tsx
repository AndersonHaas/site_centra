import { assertUnitActive } from "@/lib/group/guard";
import type { Market } from "@/lib/group/market";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ConstrucaoLayout({ children, params }: Props) {
  const { locale } = await params;
  assertUnitActive(locale as Market, "construcao");
  return children;
}
