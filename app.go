package main

import (
	"context"
	"errors"
	"fmt"
	"os/exec"
	"strings"
)

var (
	lookPath       = exec.LookPath
	commandContext = exec.CommandContext
)

type App struct {
	ctx context.Context
}

type ScanRequest struct {
	Target      string `json:"target"`
	Ports       string `json:"ports"`
	VersionScan bool   `json:"versionScan"`
	OSScan      bool   `json:"osScan"`
	UDPScan     bool   `json:"udpScan"`
	ExtraArgs   string `json:"extraArgs"`
}

type ScanResult struct {
	Command  []string `json:"command"`
	Output   string   `json:"output"`
	ExitCode int      `json:"exitCode"`
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) CheckNmap() string {
	path, err := lookPath("nmap")
	if err != nil {
		return ""
	}
	return path
}

func (a *App) BuildCommand(req ScanRequest) ([]string, error) {
	target := strings.TrimSpace(req.Target)
	if target == "" {
		return nil, errors.New("target is required")
	}

	command := []string{"nmap"}

	if req.VersionScan {
		command = append(command, "-sV")
	}
	if req.OSScan {
		command = append(command, "-O")
	}
	if req.UDPScan {
		command = append(command, "-sU")
	}

	if ports := strings.TrimSpace(req.Ports); ports != "" {
		command = append(command, "-p", ports)
	}

	if extra := strings.TrimSpace(req.ExtraArgs); extra != "" {
		command = append(command, strings.Fields(extra)...)
	}

	command = append(command, target)
	return command, nil
}

func (a *App) RunScan(req ScanRequest) (ScanResult, error) {
	command, err := a.BuildCommand(req)
	if err != nil {
		return ScanResult{}, err
	}

	if _, err := lookPath("nmap"); err != nil {
		return ScanResult{}, errors.New("nmap was not found on PATH")
	}

	cmd := commandContext(a.ctx, command[0], command[1:]...)
	output, runErr := cmd.CombinedOutput()

	result := ScanResult{
		Command: command,
		Output:  string(output),
	}

	if runErr == nil {
		return result, nil
	}

	var exitErr *exec.ExitError
	if errors.As(runErr, &exitErr) {
		result.ExitCode = exitErr.ExitCode()
		return result, fmt.Errorf("scan failed with exit code %d", result.ExitCode)
	}

	return result, runErr
}
