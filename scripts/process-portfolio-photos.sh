#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

SRC_ROOT="../Fotos Marketing"
DEST_DIR="public/images/portfolio"
mkdir -p "$DEST_DIR"

process_obra() {
  local slug="$1"
  local folder="$2"
  local src="$SRC_ROOT/$folder"

  if [ ! -d "$src" ]; then
    echo "ERRO: pasta não encontrada: $src" >&2
    exit 1
  fi

  local files=()
  while IFS= read -r f; do
    files+=("$f")
  done < <(find "$src" -maxdepth 1 -type f \( -iname "DJI_*.jpg" -o -iname "DJI_*.jpeg" \) | sort)

  while IFS= read -r f; do
    local already=0
    for existing in "${files[@]:-}"; do
      [ "$existing" = "$f" ] && already=1 && break
    done
    if [ "$already" -eq 0 ]; then
      files+=("$f")
    fi
  done < <(find "$src" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | sort)

  local n=1
  for f in "${files[@]}"; do
    if [ "$n" -gt 3 ]; then
      break
    fi
    sips -Z 2000 -s format jpeg -s formatOptions 80 "$f" --out "$DEST_DIR/${slug}-${n}.jpg" >/dev/null
    echo "  ${slug}-${n}.jpg <- $(basename "$f")"
    n=$((n + 1))
  done
}

process_obra "cvale-bairro-catarinense" "CVale - Bairro Catarinense"
process_obra "cvale-encantado" "CVale - Encantado"
process_obra "cvale-insumos-alto-piquiri" "CVale - Insumos Alto Piquiri"
process_obra "cvale-obra-285-cd" "CVale - Obra 285 - CD"
process_obra "cvale-sao-francisco" "CVale - São Francisco"
process_obra "cvale-sede-administrativa" "CVale Sede Administrativa"
process_obra "cvale-supermercado-maripa" "CVale - Supermercado Maripá"
process_obra "cvale-upd" "CVale - UPD"
process_obra "cvale-universidade" "CVale - Universidade"
process_obra "copacol-cpa" "Copacol - CPA"
process_obra "copacol-matrizeiros" "Copacol - Matrizeiros"
process_obra "copacol-obra-225-unidade-nova-aurora" "Copacol - Obra 225 - Unidade Nova Aurora"
process_obra "copacol-obra-229-unidade-penha" "Copacol - Obra 229 - Unidade Penha"
process_obra "copacol-obra-271-amidonaria" "Copacol - Obra 271 - Amidonaria"
process_obra "copacol-obra-307-urs" "Copacol - Obra 307 - URS"
process_obra "copacol-silo-jesuitas" "Copacol - Silo Jesuítas"
process_obra "copacol-upd" "Copacol - UPD"

echo "Total de imagens geradas: $(ls "$DEST_DIR" | wc -l | tr -d ' ')"
