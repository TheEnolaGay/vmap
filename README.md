# vmap

`vmap` is a graphical `nmap` tool built with Go and Wails.

This repository is now scaffolded as a native desktop application with:

- Go backend for scan orchestration
- Wails desktop shell
- React + TypeScript frontend
- a starter scan form that executes `nmap` and shows raw output

## Prerequisites

- Go 1.22+
- Node.js 20+
- `nmap` installed and available on your `PATH`
- Wails CLI

Install Wails CLI:

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

## Run In Development

```bash
make bootstrap
make dev
```

## Build

```bash
make build
```

## Validation

Core repo validation commands:

```bash
make verify
make ci
```

`make verify` runs format checks, lint, backend tests, frontend tests, documentation policy checks, and branch-name validation.

`make ci` runs the full verification suite plus a Wails build smoke test.

## Notes

The frontend expects Wails-generated bindings under `frontend/wailsjs`. Those are created when you run `wails dev` or `wails generate bindings`.

Ubuntu 24.04 ships `webkit2gtk-4.1`, while Wails v2 still asks `pkg-config` for `webkit2gtk-4.0`. This repo includes local compatibility `.pc` shims under `pkgconfig/`, and the provided `make` targets export the required `PKG_CONFIG_PATH` automatically.

## Workflow

This repo uses a strict GitFlow process:

- `main` for production
- `develop` for integration
- `feature/*`, `bugfix/*`, `release/*`, and `hotfix/*` branches for work

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/process/gitflow.md](docs/process/gitflow.md).

## Next Steps

- parse XML output into structured host and service results
- add scan history and saved profiles
- support advanced presets and arguments safely
- visualize port and host state changes over time
