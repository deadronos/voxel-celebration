#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/skills/"
DST="$ROOT/.github/skills/"

mkdir -p "$DST"

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$SRC" "$DST"
else
  echo "rsync not found, using cp fallback"
  rm -rf "$DST"/* || true
  cp -a "$SRC"/* "$DST"/
fi

echo "Synced $SRC -> $DST"

if [ "${1:-}" = "--commit" ]; then
  git add .github/skills
  git commit -m "chore(skills): sync .github/skills from skills/ (automated)"
  echo "Committed changes"
fi
