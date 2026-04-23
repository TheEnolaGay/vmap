import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const mocks = vi.hoisted(() => ({
  BuildCommand: vi.fn(),
  CheckNmap: vi.fn(),
  RunScan: vi.fn(),
}));

vi.mock("../wailsjs/go/main/App", () => mocks);

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.CheckNmap.mockResolvedValue("/usr/bin/nmap");
    mocks.BuildCommand.mockResolvedValue(["nmap", "-sV", "scanme.nmap.org"]);
    mocks.RunScan.mockResolvedValue({
      command: ["nmap", "-sV", "scanme.nmap.org"],
      output: "scan complete",
      exitCode: 0,
    });
  });

  it("shows the nmap path after startup", async () => {
    render(<App />);

    await screen.findByText("nmap: /usr/bin/nmap");
  });

  it("updates the command preview when the target changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Target"), "scanme.nmap.org");

    await waitFor(() => {
      expect(mocks.BuildCommand).toHaveBeenCalled();
    });

    expect(
      await screen.findByText("nmap -sV scanme.nmap.org"),
    ).toBeInTheDocument();
  });

  it("renders scan output after a successful run", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Target"), "scanme.nmap.org");
    await user.click(screen.getByRole("button", { name: "Run Scan" }));

    expect(await screen.findByText("scan complete")).toBeInTheDocument();
    expect(screen.getByText("Scan complete")).toBeInTheDocument();
  });

  it("renders an error message when the scan fails", async () => {
    const user = userEvent.setup();
    mocks.RunScan.mockRejectedValue(new Error("scan failed with exit code 7"));
    render(<App />);

    await user.type(screen.getByLabelText("Target"), "scanme.nmap.org");
    await user.click(screen.getByRole("button", { name: "Run Scan" }));

    expect(
      await screen.findByText("scan failed with exit code 7"),
    ).toBeInTheDocument();
    expect(screen.getByText("Scan failed")).toBeInTheDocument();
  });
});
