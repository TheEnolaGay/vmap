# GitFlow Workflow

## Long-Lived Branches

- `main` contains production-ready commits only.
- `develop` is the integration branch for planned work.

## Supporting Branches

- `feature/<short-name>` for new capabilities
- `bugfix/<short-name>` for defects not requiring an urgent production patch
- `release/<version>` for release hardening and documentation
- `hotfix/<short-name>` for urgent production fixes

## Merge Targets

- `feature/*` and `bugfix/*` must target `develop`.
- `release/*` must merge into `main`, then back into `develop`.
- `hotfix/*` must merge into `main`, then back into `develop`.

## Enforcement

- Branch names are validated by `scripts/check-branch-name.sh`.
- Direct local commits and pushes from `main`, `master`, and `develop` are blocked by `scripts/protect-branches.sh`.
- Local hooks run format, lint, docs, and test checks.
- GitHub branch protections must require PRs and passing checks for `main` and `develop`.

## Release Ownership

- Releases are cut manually.
- Every release branch must update `CHANGELOG.md`.
- Every release or hotfix must complete the release checklist in [release-checklist.md](release-checklist.md).
