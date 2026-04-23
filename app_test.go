package main

import (
	"context"
	"errors"
	"os/exec"
	"reflect"
	"testing"
)

func TestBuildCommandRequiresTarget(t *testing.T) {
	app := NewApp()

	_, err := app.BuildCommand(ScanRequest{})
	if err == nil {
		t.Fatal("expected error for missing target")
	}
}

func TestBuildCommandIncludesSelectedFlags(t *testing.T) {
	app := NewApp()

	got, err := app.BuildCommand(ScanRequest{
		Target:      "scanme.nmap.org",
		Ports:       "22,80,443",
		VersionScan: true,
		OSScan:      true,
		UDPScan:     true,
		ExtraArgs:   "-T4 -Pn",
	})
	if err != nil {
		t.Fatalf("BuildCommand returned error: %v", err)
	}

	want := []string{"nmap", "-sV", "-O", "-sU", "-p", "22,80,443", "-T4", "-Pn", "scanme.nmap.org"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("unexpected command: got %v want %v", got, want)
	}
}

func TestCheckNmapReturnsEmptyWhenMissing(t *testing.T) {
	original := lookPath
	lookPath = func(string) (string, error) {
		return "", errors.New("missing")
	}
	defer func() {
		lookPath = original
	}()

	app := NewApp()
	if got := app.CheckNmap(); got != "" {
		t.Fatalf("expected empty path, got %q", got)
	}
}

func TestRunScanReturnsNotFoundError(t *testing.T) {
	original := lookPath
	lookPath = func(string) (string, error) {
		return "", errors.New("missing")
	}
	defer func() {
		lookPath = original
	}()

	app := NewApp()
	app.startup(context.Background())

	_, err := app.RunScan(ScanRequest{Target: "127.0.0.1"})
	if err == nil || err.Error() != "nmap was not found on PATH" {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestRunScanPropagatesExitCode(t *testing.T) {
	originalLookPath := lookPath
	originalCommandContext := commandContext
	lookPath = func(string) (string, error) {
		return "/usr/bin/nmap", nil
	}
	commandContext = func(ctx context.Context, name string, args ...string) *exec.Cmd {
		return exec.CommandContext(ctx, "sh", "-c", "printf 'boom'; exit 7")
	}
	defer func() {
		lookPath = originalLookPath
		commandContext = originalCommandContext
	}()

	app := NewApp()
	app.startup(context.Background())

	result, err := app.RunScan(ScanRequest{Target: "127.0.0.1"})
	if err == nil {
		t.Fatal("expected error")
	}
	if result.ExitCode != 7 {
		t.Fatalf("expected exit code 7, got %d", result.ExitCode)
	}
	if result.Output != "boom" {
		t.Fatalf("unexpected output %q", result.Output)
	}
}
