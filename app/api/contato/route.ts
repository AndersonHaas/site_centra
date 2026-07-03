import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContatoPayload = {
  nome: string;
  empresa?: string;
  email: string;
  telefone?: string;
  mensagem?: string;
};

type FieldErrors = Partial<Record<keyof ContatoPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "contato@centraengenharia.com.br";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Site Centra <onboarding@resend.dev>";

function validate(body: Partial<ContatoPayload>): FieldErrors {
  const errors: FieldErrors = {};

  const nome = (body.nome ?? "").trim();
  if (!nome) errors.nome = "Informe seu nome.";
  else if (nome.length > 120) errors.nome = "Nome muito longo (máx. 120 caracteres).";

  const email = (body.email ?? "").trim();
  if (!email) errors.email = "Informe seu e-mail.";
  else if (email.length > 160 || !EMAIL_RE.test(email)) {
    errors.email = "E-mail inválido.";
  }

  if (body.empresa && body.empresa.length > 120) {
    errors.empresa = "Nome da empresa muito longo.";
  }
  if (body.telefone && body.telefone.length > 30) {
    errors.telefone = "Telefone muito longo.";
  }
  if (body.mensagem && body.mensagem.length > 2000) {
    errors.mensagem = "Mensagem muito longa (máx. 2000 caracteres).";
  }

  return errors;
}

export async function POST(request: Request) {
  let body: Partial<ContatoPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requisição inválida." },
      { status: 400 },
    );
  }

  const fieldErrors = validate(body);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { ok: false, fieldErrors },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[contato] RESEND_API_KEY não configurada — e-mail não enviado.",
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "Não foi possível enviar sua mensagem agora. Tente novamente em breve ou fale com a gente por telefone/e-mail.",
      },
      { status: 503 },
    );
  }

  const { nome, empresa, email, telefone, mensagem } = body as ContatoPayload;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Novo contato pelo site — ${nome}`,
      text: [
        `Nome: ${nome}`,
        empresa ? `Empresa: ${empresa}` : null,
        `E-mail: ${email}`,
        telefone ? `Telefone: ${telefone}` : null,
        "",
        "Mensagem:",
        mensagem || "(não informada)",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("[contato] Falha ao enviar via Resend:", error);
      return NextResponse.json(
        {
          ok: false,
          error:
            "Não foi possível enviar sua mensagem agora. Tente novamente em breve ou fale com a gente por telefone/e-mail.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contato] Erro inesperado ao enviar e-mail:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Não foi possível enviar sua mensagem agora. Tente novamente em breve ou fale com a gente por telefone/e-mail.",
      },
      { status: 500 },
    );
  }
}
