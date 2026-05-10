#!/bin/bash
# Install CNC Guide skill for Claude Code
# Run this on any machine where you want the /cnc-guide skill available

set -e

SKILL_DIR="$HOME/.claude/skills/cnc-guide"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/skill"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: skill/ directory not found. Run this from the cnc-guide repo root."
  exit 1
fi

mkdir -p "$SKILL_DIR/references"
cp "$SOURCE_DIR/SKILL.md" "$SKILL_DIR/"
cp "$SOURCE_DIR/references/"*.md "$SKILL_DIR/references/"

echo "CNC Guide skill installed to $SKILL_DIR"
echo "Restart Claude Code to activate. Use /cnc-guide or just ask a CNC question."
