import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import { BuildCommand, CheckNmap, RunScan } from "../wailsjs/go/main/App";

type ScanRequest = {
  target: string;
  ports: string;
  versionScan: boolean;
  osScan: boolean;
  udpScan: boolean;
  extraArgs: string;
};

type ScanResult = {
  command: string[];
  output: string;
  exitCode: number;
};

const initialState: ScanRequest = {
  target: "",
  ports: "",
  versionScan: true,
  osScan: false,
  udpScan: false,
  extraArgs: "",
};

export default function App() {
  const [form, setForm] = useState<ScanRequest>(initialState);
  const [commandPreview, setCommandPreview] = useState<string>("nmap");
  const [output, setOutput] = useState<string>("");
  const [status, setStatus] = useState<string>("Ready");
  const [nmapPath, setNmapPath] = useState<string>("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    CheckNmap()
      .then((path) => setNmapPath(path))
      .catch(() => setNmapPath(""));
  }, []);

  useEffect(() => {
    BuildCommand(form)
      .then((command) => setCommandPreview(command.join(" ")))
      .catch(() => setCommandPreview("nmap"));
  }, [form]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setRunning(true);
    setStatus("Running scan...");
    setOutput("");

    try {
      const result = (await RunScan(form)) as ScanResult;
      setOutput(result.output || "Scan completed with no output.");
      setStatus(
        result.exitCode === 0
          ? "Scan complete"
          : `Exited with code ${result.exitCode}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setOutput((current) => `${current}${current ? "\n\n" : ""}${message}`);
      setStatus("Scan failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <h1>vmap</h1>
        <div className={`status-chip ${nmapPath ? "ok" : "warn"}`}>
          {nmapPath ? `nmap: ${nmapPath}` : "nmap not found"}
        </div>
      </header>

      <section className="panel">
        <form className="scan-form" onSubmit={handleSubmit}>
          <label>
            <span>Target</span>
            <input
              value={form.target}
              onChange={(event) =>
                setForm({ ...form, target: event.target.value })
              }
              placeholder="scanme.nmap.org or 192.168.1.0/24"
            />
          </label>

          <label>
            <span>Ports</span>
            <input
              value={form.ports}
              onChange={(event) =>
                setForm({ ...form, ports: event.target.value })
              }
              placeholder="22,80,443 or 1-1024"
            />
          </label>

          <label>
            <span>Extra Args</span>
            <input
              value={form.extraArgs}
              onChange={(event) =>
                setForm({ ...form, extraArgs: event.target.value })
              }
              placeholder="-T4 -Pn"
            />
          </label>

          <div className="toggles">
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.versionScan}
                onChange={(event) =>
                  setForm({ ...form, versionScan: event.target.checked })
                }
              />
              <span>Version Detection</span>
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={form.osScan}
                onChange={(event) =>
                  setForm({ ...form, osScan: event.target.checked })
                }
              />
              <span>OS Detection</span>
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={form.udpScan}
                onChange={(event) =>
                  setForm({ ...form, udpScan: event.target.checked })
                }
              />
              <span>UDP Scan</span>
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={running}>
              {running ? "Running..." : "Run Scan"}
            </button>
            <code>{commandPreview}</code>
          </div>
        </form>
      </section>

      <section className="panel output-panel">
        <div className="output-header">
          <h2>Output</h2>
          <span className="run-status">{status}</span>
        </div>
        <pre>{output || "Scan output will appear here."}</pre>
      </section>
    </main>
  );
}
