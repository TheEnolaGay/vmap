# Release Checklist

Use this checklist from `release/*` and `hotfix/*` branches.

## Before Merge

- [ ] `make ci` passes
- [ ] `CHANGELOG.md` is updated
- [ ] release notes are reviewed
- [ ] docs for user-visible changes are updated
- [ ] version and packaging impact is reviewed

## Merge Order

- [ ] merge release or hotfix branch into `main`
- [ ] tag the release from `main`
- [ ] merge the same branch or resulting merge commit back into `develop`

## After Merge

- [ ] publish release notes in GitHub
- [ ] verify tagged artifact or installer build
- [ ] create follow-up issues for deferred work
