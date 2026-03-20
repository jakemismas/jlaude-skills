#!/usr/bin/env bash
# sync.sh: Pull latest, re-symlink, re-register hooks, report counts.
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
  echo "Syncing global-CLAUDE.md → $CLAUDE_DIR/CLAUDE.md"
  cp "$SKILLS_DIR/global-CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
fi

# Count before
SKILLS_BEFORE=$(find "$SKILLS_DIR/skills" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
VENDOR_BEFORE=$(find "$SKILLS_DIR/skills/vendor" -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')

# Re-create symlink directories
mkdir -p "$CLAUDE_DIR/skills" "$CLAUDE_DIR/agents" "$CLAUDE_DIR/commands"

# Symlink skills
for dir in "$SKILLS_DIR/skills/public"/* "$SKILLS_DIR/skills/custom"/* "$SKILLS_DIR/skills/vendor"/*; do
  if [ -d "$dir" ]; then
    name=$(basename "$dir")
    ln -sf "$dir" "$CLAUDE_DIR/skills/$name" 2>/dev/null || true
  fi
done

# Symlink agents
for file in "$SKILLS_DIR/agents"/*.md; do
  if [ -f "$file" ]; then
    ln -sf "$file" "$CLAUDE_DIR/agents/$(basename "$file")" 2>/dev/null || true
  fi
done

# Symlink commands
for file in "$SKILLS_DIR/commands"/*.md; do
  if [ -f "$file" ]; then
    ln -sf "$file" "$CLAUDE_DIR/commands/$(basename "$file")" 2>/dev/null || true
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
