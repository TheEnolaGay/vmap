# Documentation Policy

Documentation is a merge gate for this repository.

## When Docs Are Required

- User-visible behavior changes require an update to `README.md`, `CHANGELOG.md`, or a relevant page under `docs/`.
- Workflow, tooling, architecture, packaging, test harness, and CI changes require an ADR update under `docs/adr/`.
- Release and hotfix work must keep the release checklist and changelog current.

## Enforcement Model

- `scripts/docs-check.sh` validates documentation coverage.
- Local hooks run the docs check before commits are created.
- CI runs the same docs check on pull requests and protected branches.

## Acceptable No-Doc Changes

- Narrow refactors with no behavior or workflow impact
- Pure formatting changes
- Comment-only updates

If the docs check fails, either update the relevant docs or narrow the staged changes so the policy matches the change.
