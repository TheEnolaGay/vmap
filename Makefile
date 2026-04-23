PKG_CONFIG_PATH := $(CURDIR)/pkgconfig:$(PKG_CONFIG_PATH)
GOCACHE := $(CURDIR)/.cache/go-build
GOMODCACHE := $(CURDIR)/.cache/gomod
NPM_CONFIG_CACHE := $(CURDIR)/.cache/npm
PRETTIER := ./frontend/node_modules/.bin/prettier
ESLINT := ./frontend/node_modules/.bin/eslint
VITEST := ./frontend/node_modules/.bin/vitest
MARKDOWNLINT := ./frontend/node_modules/.bin/markdownlint-cli2
GOPACKAGES := $(shell GOCACHE=$(CURDIR)/.cache/go-build GOMODCACHE=$(CURDIR)/.cache/gomod go list ./... | grep -v '/frontend/')

export GOCACHE
export GOMODCACHE
export NPM_CONFIG_CACHE

.PHONY: bootstrap dev build build-smoke doctor fmt fmt-check lint test test-backend test-frontend docs-check branch-check verify ci

bootstrap:
	mkdir -p .cache/go-build .cache/gomod .cache/npm
	git config core.hooksPath .githooks
	npm --prefix frontend install
	go mod download
	@echo "Local hooks configured at .githooks"

dev:
	PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)" wails dev

build:
	PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)" wails build -nopackage

build-smoke:
	PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)" wails build -nopackage

doctor:
	PKG_CONFIG_PATH="$(PKG_CONFIG_PATH)" wails doctor

fmt:
	gofmt -w *.go
	$(PRETTIER) --write .

fmt-check:
	test -z "$$(gofmt -l *.go)"
	$(PRETTIER) --check .

lint:
	go vet $(GOPACKAGES)
	cd frontend && npm run lint
	$(MARKDOWNLINT)

test: test-backend test-frontend

test-backend:
	go test $(GOPACKAGES)

test-frontend:
	cd frontend && npm run test

docs-check:
	./scripts/docs-check.sh

branch-check:
	./scripts/check-branch-name.sh

verify: fmt-check lint test docs-check branch-check

ci: verify build-smoke
