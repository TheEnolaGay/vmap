# ADR 0001: Workflow Governance

- Status: Accepted
- Date: 2026-04-23

## Context

`vmap` is a young repository with no release history, no established branch policy, and no automated validation. Without enforcement, quality drift and workflow inconsistency will compound quickly.

## Decision

The repository adopts:

- full GitFlow with `main` and `develop`
- local hooks managed through `.githooks/`
- local protected-branch guards for `main`, `master`, and `develop`
- shared validation entrypoints in `Makefile`
- mandatory backend tests, frontend tests, linting, formatting, and docs policy checks
- GitHub pull request templates, issue templates, CODEOWNERS, and CI workflows
- manual tagged releases with a maintained changelog and release checklist

## Consequences

- day-to-day contribution cost increases slightly because checks and docs are mandatory
- release and hotfix work becomes auditable
- workflow changes must be deliberate and documented through future ADRs
