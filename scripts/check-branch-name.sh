#!/usr/bin/env bash
set -euo pipefail

branch="${1:-${GITHUB_HEAD_REF:-$(git branch --show-current 2>/dev/null || true)}}"

if [[ -z "$branch" || "$branch" == "HEAD" ]]; then
  echo "Skipping branch-name check: detached HEAD or no current branch"
  exit 0
fi

case "$branch" in
  main|develop|master|feature/*|bugfix/*|release/*|hotfix/*)
    exit 0
    ;;
  *)
    echo "Invalid branch name: $branch"
    echo "Allowed: main, develop, master, feature/*, bugfix/*, release/*, hotfix/*"
    exit 1
    ;;
esac
