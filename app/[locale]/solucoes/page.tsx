import { redirect } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SolucoesRedirect({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/construcao", locale: locale as "br" | "py" });
}
