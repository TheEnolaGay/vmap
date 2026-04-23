# GitHub Branch Protection

Apply these rules to `main` and `develop`.

## Required Settings

- require a pull request before merging
- require at least one approval
- dismiss stale approvals when new commits are pushed
- require conversation resolution before merging
- require status checks before merging
- block force pushes
- block branch deletion

## Required Checks

- `verify`
- `build-smoke`
- `release-policy` for `release/*` and `hotfix/*` branches when applicable

## Ownership

Use `.github/CODEOWNERS` so backend, frontend, and workflow changes have explicit reviewers.
