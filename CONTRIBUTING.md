# Contributing

`vmap` uses a strict GitFlow workflow with enforced local and CI validation.

## Branch Model

- `main`: production-ready history only
- `develop`: integration branch for upcoming work
- `feature/*`: new work branching from `develop`
- `bugfix/*`: defect work branching from `develop`
- `release/*`: release preparation branching from `develop`
- `hotfix/*`: urgent production fixes branching from `main`

Merge rules:

- feature and bugfix branches merge into `develop`
- release branches merge into `main` and back into `develop`
- hotfix branches merge into `main` and back into `develop`
- direct pushes to `main` and `develop` are forbidden once branch protections are enabled

## Required Local Setup

Run:

```bash
make bootstrap
```

This installs frontend tooling, downloads Go modules, and configures `.githooks/` as the active hook directory.

## Required Validation

Before opening a PR, `make verify` must pass.

Validation includes:

- formatting checks
- backend tests
- frontend tests
- lint checks
- docs policy checks
- branch naming checks

For release readiness, run:

```bash
make ci
```

## Documentation Policy

- Any user-visible change must update `README.md`, `CHANGELOG.md`, or a relevant page under `docs/`.
- Any workflow, tooling, architecture, or build-system change must update an ADR in `docs/adr/`.
- Release and hotfix changes must keep `docs/process/release-checklist.md` current.

See [docs/process/docs-policy.md](docs/process/docs-policy.md) and [docs/process/gitflow.md](docs/process/gitflow.md).

## Pull Requests

- Use the PR template in `.github/PULL_REQUEST_TEMPLATE.md`.
- Include linked issues, test evidence, and documentation impact.
- Keep PRs focused on one change stream.
- Do not open PRs that fail required checks.
