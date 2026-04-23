#!/usr/bin/env bash
set -euo pipefail

changed_files() {
  if [[ -n "${BASE_SHA:-}" && -n "${HEAD_SHA:-}" ]]; then
    git diff --name-only "$BASE_SHA" "$HEAD_SHA"
    return
  fi

  if [[ "${CI:-}" == "true" ]]; then
    if git rev-parse --verify HEAD^ >/dev/null 2>&1; then
      git diff --name-only HEAD^ HEAD
    else
      git ls-files
    fi
    return
  fi

  if git rev-parse --verify HEAD >/dev/null 2>&1; then
    git diff --cached --name-only --diff-filter=ACMR HEAD
  else
    git ls-files --cached --others --exclude-standard
  fi
}

mapfile -t files < <(changed_files | sed '/^$/d')

if [[ "${#files[@]}" -eq 0 ]]; then
  echo "No staged or compared changes to validate"
  exit 0
fi

docs_changed=0
adr_changed=0
code_changed=0
workflow_changed=0

for file in "${files[@]}"; do
  case "$file" in
    README.md|CONTRIBUTING.md|CHANGELOG.md|docs/*)
      docs_changed=1
      ;;
  esac

  case "$file" in
    docs/adr/*)
      adr_changed=1
      ;;
  esac

  case "$file" in
    *.go|frontend/*|main.go|app.go|go.mod|go.sum|Makefile|wails.json|pkgconfig/*|scripts/*|.githooks/*|.github/workflows/*|.editorconfig|.prettierrc.json|.markdownlint-cli2.jsonc)
      code_changed=1
      ;;
  esac

  case "$file" in
    Makefile|go.mod|go.sum|wails.json|pkgconfig/*|scripts/*|.githooks/*|.github/workflows/*|.editorconfig|.prettierrc.json|.markdownlint-cli2.jsonc)
      workflow_changed=1
      ;;
  esac
done

if [[ "$code_changed" -eq 1 && "$docs_changed" -eq 0 ]]; then
  echo "Code or workflow changes require documentation updates in README.md, CONTRIBUTING.md, CHANGELOG.md, or docs/"
  exit 1
fi

if [[ "$workflow_changed" -eq 1 && "$adr_changed" -eq 0 ]]; then
  echo "Workflow, tooling, or architecture changes require a docs/adr update"
  exit 1
fi

echo "Documentation policy satisfied"
