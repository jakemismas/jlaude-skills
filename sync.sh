#!/usr/bin/env bash
# sync.sh: Pull latest, copy skills/agents/commands to ~/.claude, report counts.
# Windows-compatible: uses cp instead of ln -sf (symlinks require elevated privileges on Windows).
set -e

SKILLS_DIR="$HOME/claude-skills"
CLAUDE_DIR="$HOME/.claude"

echo "=== Syncing claude-skills ==="

# Pull latest
cd "$SKILLS_DIR"
if git remote get-url origin &>/dev/null; then
  echo "Pulling from origin..."
  git pull origin main --ff-only 2>/dev/null || echo "Pull skipped (no remote tracking or conflicts)"
else
  echo "No remote configured, skipping pull"
fi

# Sync global CLAUDE.md
if [ -f "$SKILLS_DIR/global-CLAUDE.md" ]; then
  echo "Syncing global-CLAUDE.md -> $CLAUDE_DIR/CLAUDE.md"
  cp "$SKILLS_DIR/global-CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
fi

# Count before
SKILLS_BEFORE=$(find "$SKILLS_DIR/skills" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
VENDOR_BEFORE=$(find "$SKILLS_DIR/skills/vendor" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')

# Re-create target directories
mkdir -p "$CLAUDE_DIR/skills" "$CLAUDE_DIR/agents" "$CLAUDE_DIR/commands"

# Detect OS: on Windows (MSYS/Git Bash/Cygwin), symlinks silently misbehave
IS_WINDOWS=false
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) IS_WINDOWS=true ;;
esac

# Helper: symlink on Unix, copy on Windows
link_or_copy() {
  local src="$1"
  local dest="$2"

  # Always remove stale target first
  rm -rf "$dest" 2>/dev/null || true

  if [ "$IS_WINDOWS" = "true" ]; then
    # Windows: copy (symlinks are unreliable in Git Bash)
    if [ -d "$src" ]; then
      cp -r "$src" "$dest"
    else
      cp -f "$src" "$dest"
    fi
  else
    # Unix: proper symlink
    ln -sf "$src" "$dest"
  fi
}

# Sync skills
for dir in "$SKILLS_DIR/skills/public"/* "$SKILLS_DIR/skills/custom"/* "$SKILLS_DIR/skills/vendor"/*; do
  if [ -d "$dir" ]; then
    name=$(basename "$dir")
    link_or_copy "$dir" "$CLAUDE_DIR/skills/$name"
  fi
done

# Sync agents
for file in "$SKILLS_DIR/agents"/*.md; do
  if [ -f "$file" ]; then
    link_or_copy "$file" "$CLAUDE_DIR/agents/$(basename "$file")"
  fi
done

# Sync commands
for file in "$SKILLS_DIR/commands"/*.md; do
  if [ -f "$file" ]; then
    link_or_copy "$file" "$CLAUDE_DIR/commands/$(basename "$file")"
  fi
done

# Count after
SKILLS_AFTER=$(find "$SKILLS_DIR/skills" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
AGENTS=$(find "$SKILLS_DIR/agents" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
COMMANDS=$(find "$SKILLS_DIR/commands" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
INSTINCTS=$(find "$SKILLS_DIR/instincts" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
VENDOR_AFTER=$(find "$SKILLS_DIR/skills/vendor" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "=== Counts ==="
echo "Skills:    $SKILLS_AFTER (was $SKILLS_BEFORE)"
echo "Agents:    $AGENTS"
echo "Commands:  $COMMANDS"
echo "Instincts: $INSTINCTS"

if [ "$VENDOR_AFTER" -gt "$VENDOR_BEFORE" ] 2>/dev/null; then
  NEW_VENDOR=$((VENDOR_AFTER - VENDOR_BEFORE))
  echo "New vendor skills: $NEW_VENDOR"
fi

# Security scan (if available)
echo ""
echo "=== Security Scan ==="
if command -v npx &>/dev/null; then
  npx ecc-agentshield scan "$SKILLS_DIR" 2>/dev/null || echo "ecc-agentshield not available or scan skipped"
else
  echo "npx not available, skipping security scan"
fi

echo ""
echo "=== Sync complete ==="
