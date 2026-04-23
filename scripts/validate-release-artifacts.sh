#!/usr/bin/env bash
set -euo pipefail

branch="${1:-${GITHUB_HEAD_REF:-$(git branch --show-current 2>/dev/null || true)}}"

case "$branch" in
  release/*|hotfix/*)
    ;;
  *)
    echo "Skipping release artifact validation for branch: ${branch:-unknown}"
    exit 0
    ;;
esac

required_files=(
  "CHANGELOG.md"
  "docs/process/release-checklist.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required release artifact: $file"
    exit 1
  fi
done

if ! grep -q "Release Checklist" docs/process/release-checklist.md; then
  echo "Release checklist document is missing the expected heading"
  exit 1
fi

echo "Release artifacts present for $branch"
