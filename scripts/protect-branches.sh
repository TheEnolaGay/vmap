#!/usr/bin/env bash
set -euo pipefail

allow_release=0
if [[ "${1:-}" == "--allow-release" ]]; then
  allow_release=1
fi

branch="${GITHUB_HEAD_REF:-$(git branch --show-current 2>/dev/null || true)}"

if [[ -z "$branch" || "$branch" == "HEAD" ]]; then
  exit 0
fi

case "$branch" in
  main|master|develop)
    echo "Direct local commits or pushes from protected branch '$branch' are blocked."
    echo "Create a feature/, bugfix/, release/, or hotfix/ branch instead."
    exit 1
    ;;
  release/*|hotfix/*)
    if [[ "$allow_release" -eq 1 ]]; then
      exit 0
    fi
    ;;
esac

exit 0
