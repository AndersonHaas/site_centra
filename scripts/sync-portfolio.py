#!/usr/bin/env python3
"""Sincroniza o portfólio de obras a partir da pasta "Fotos Marketing".

Uso: pnpm run fotos

O que faz:
  1. Lê cada subpasta de "Fotos Marketing" (uma pasta por obra).
  2. Escolhe a foto de capa e mais 2 fotos de apoio.
  3. Redimensiona/otimiza as fotos para public/images/portfolio/.
  4. Gera lib/portfolio-data.ts com os dados de cada obra (sem edição manual).

Como escolher a foto de capa:
  Renomeie o arquivo da foto desejada incluindo a palavra "capa" no nome
  (ex.: "capa-fachada.jpg"). Essa foto sempre vira a primeira do card e do
  lightbox. Sem esse nome, o script usa a mesma regra de antes: prioriza
  fotos aéreas (DJI_*) e, na falta delas, a primeira em ordem alfabética.

Como adicionar uma obra nova:
  Crie uma pasta em "Fotos Marketing" no formato "<Cliente> - <Nome da obra>"
  (cliente = "C.Vale" ou "Copacol"), coloque as fotos dentro e rode o script.
"""

import json
import re
import subprocess
import unicodedata
from pathlib import Path

SITE_DIR = Path(__file__).resolve().parent.parent
SRC_ROOT = SITE_DIR.parent / "Fotos Marketing"
DEST_DIR = SITE_DIR / "public" / "images" / "portfolio"
OUTPUT_TS = SITE_DIR / "lib" / "portfolio-data.ts"
OVERRIDES_PATH = SITE_DIR / "scripts" / "portfolio-overrides.json"

MAX_PHOTOS = 3
IMAGE_EXTS = {".jpg", ".jpeg"}

CLIENT_PATTERNS = [
    (re.compile(r"^c\.?\s*vale\b[\s\-]*", re.IGNORECASE), "C.Vale", "cvale"),
    (re.compile(r"^copacol\b[\s\-]*", re.IGNORECASE), "Copacol", "copacol"),
]
CLIENT_ORDER = ["C.Vale", "Copacol"]


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def parse_folder_name(folder_name):
    for pattern, client, client_slug in CLIENT_PATTERNS:
        match = pattern.match(folder_name)
        if match:
            remainder = folder_name[match.end():].strip(" -")
            title = re.sub(r"^Obra\s+\d+\s*-\s*", "", remainder, flags=re.IGNORECASE).strip()
            slug = f"{client_slug}-{slugify(remainder)}"
            return client, title, slug
    return None


def pick_photos(folder):
    files = sorted(
        p for p in folder.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    )
    cover = next((p for p in files if "capa" in p.name.lower()), None)
    dji = [p for p in files if p.name.upper().startswith("DJI")]

    ordered = []
    for p in [cover, *dji, *files]:
        if p and p not in ordered:
            ordered.append(p)
    return ordered[:MAX_PHOTOS]


def process_photo(src, dest):
    subprocess.run(
        [
            "sips", "-Z", "2000",
            "-s", "format", "jpeg",
            "-s", "formatOptions", "80",
            str(src), "--out", str(dest),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
    )


def main():
    if not SRC_ROOT.is_dir():
        raise SystemExit(f"ERRO: pasta não encontrada: {SRC_ROOT}")

    DEST_DIR.mkdir(parents=True, exist_ok=True)

    overrides = {}
    if OVERRIDES_PATH.is_file():
        overrides = json.loads(OVERRIDES_PATH.read_text(encoding="utf-8"))

    obras = []
    for folder in sorted(SRC_ROOT.iterdir()):
        if not folder.is_dir():
            continue
        parsed = parse_folder_name(folder.name)
        if not parsed:
            print(f"  (ignorada, cliente não reconhecido) {folder.name}")
            continue
        client, title, slug = parsed

        photos = pick_photos(folder)
        if not photos:
            print(f"  AVISO: nenhuma foto encontrada em {folder.name}")
            continue

        images = []
        for i, src in enumerate(photos, start=1):
            dest = DEST_DIR / f"{slug}-{i}.jpg"
            process_photo(src, dest)
            images.append(f"/images/portfolio/{slug}-{i}.jpg")
        cover_flag = " (capa manual)" if "capa" in photos[0].name.lower() else ""
        print(f"  {slug}: {len(images)} foto(s), capa = {photos[0].name}{cover_flag}")

        override = overrides.get(slug, {})
        country = override.get("country", "BR")
        executing_entity = override.get("executingEntity", "centra-br")
        if country not in ("BR", "PY"):
            raise SystemExit(f"ERRO: {slug}: country inválido em portfolio-overrides.json: {country!r} (use \"BR\" ou \"PY\")")
        if executing_entity not in ("centra-br", "centra-py"):
            raise SystemExit(f"ERRO: {slug}: executingEntity inválido em portfolio-overrides.json: {executing_entity!r} (use \"centra-br\" ou \"centra-py\")")
        location = override.get("location")
        year = override.get("year")
        description = override.get("description")

        missing = [f for f, v in (("year", year), ("description", description)) if v is None]
        if missing:
            print(f"    aviso: {slug} sem {', '.join(missing)} (adicione em scripts/portfolio-overrides.json)")

        obras.append({
            "slug": slug, "client": client, "title": title, "images": images,
            "country": country, "executingEntity": executing_entity,
            "location": location, "year": year, "description": description,
        })

    obras.sort(key=lambda o: (CLIENT_ORDER.index(o["client"]), o["title"].casefold()))

    known_slugs = {o["slug"] for o in obras}
    unused_overrides = set(overrides.keys()) - known_slugs
    if unused_overrides:
        print(f"AVISO: overrides sem obra correspondente (slug incorreto?): {sorted(unused_overrides)}")

    lines = [
        "/* ARQUIVO GERADO AUTOMATICAMENTE por scripts/sync-portfolio.py — não edite à mão.",
        "   Para atualizar: organize as fotos em \"Fotos Marketing/<Cliente> - <Obra>\"",
        "   e rode `pnpm run fotos`. Para escolher a capa, inclua \"capa\" no nome do arquivo.",
        "   Campos editoriais (country/executingEntity/location/year/description) vêm de",
        "   scripts/portfolio-overrides.json — edite lá, nunca aqui. */",
        "",
        "export const PROJECTS = [",
    ]
    for obra in obras:
        lines.append("  {")
        lines.append(f"    slug: {json.dumps(obra['slug'], ensure_ascii=False)},")
        lines.append(f"    client: {json.dumps(obra['client'], ensure_ascii=False)},")
        lines.append(f"    title: {json.dumps(obra['title'], ensure_ascii=False)},")
        if len(obra["images"]) == 1:
            img = json.dumps(obra["images"][0], ensure_ascii=False)
            lines.append(f"    images: [{img}],")
        else:
            lines.append("    images: [")
            for img in obra["images"]:
                lines.append(f"      {json.dumps(img, ensure_ascii=False)},")
            lines.append("    ],")
        lines.append(f"    country: {json.dumps(obra['country'], ensure_ascii=False)},")
        lines.append(f"    executingEntity: {json.dumps(obra['executingEntity'], ensure_ascii=False)},")
        if obra["location"] is not None:
            lines.append(f"    location: {json.dumps(obra['location'], ensure_ascii=False)},")
        if obra["year"] is not None:
            lines.append(f"    year: {json.dumps(obra['year'])},")
        if obra["description"] is not None:
            lines.append(f"    description: {json.dumps(obra['description'], ensure_ascii=False)},")
        lines.append("  },")
    lines.append("] as const;")
    lines.append("")

    OUTPUT_TS.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nTotal de obras: {len(obras)}")
    print(f"Gerado: {OUTPUT_TS.relative_to(SITE_DIR)}")


if __name__ == "__main__":
    main()
