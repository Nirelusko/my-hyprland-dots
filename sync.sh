#!/usr/bin/env bash
set -euo pipefail

SRC="$HOME/.config"
DST="$(cd "$(dirname "$0")" && pwd)/.config"

for d in hypr waybar rofi kitty fish ags waypaper fastfetch; do
  if [ -d "$SRC/$d" ]; then
    rsync -a --delete "$SRC/$d/" "$DST/$d/"
  fi
done

echo "Synced. Review with: git status"
