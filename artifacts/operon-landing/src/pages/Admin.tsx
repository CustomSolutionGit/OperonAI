import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme: string;
              size: string;
              type: string;
              text: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface VisitRow {
  timestamp: string;
  client: string;
  userAgent: string;
  ip: string;
}

function parseCSV(csv: string): VisitRow[] {
  const lines = csv.trim().split("\n");
  if (lines.length <= 1) return [];
  return lines.slice(1).map((line) => {
    const cols = line.match(/("(?:[^"]|"")*"|[^,]*)/g) ?? [];
    const unquote = (s: string) =>
      s.startsWith('"') ? s.slice(1, -1).replace(/""/g, '"') : s;
    return {
      timestamp: unquote(cols[0] ?? ""),
      client: unquote(cols[1] ?? ""),
      userAgent: unquote(cols[2] ?? ""),
      ip: unquote(cols[3] ?? ""),
    };
  });
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const ALLOWED_EMAIL = "vitaliykyrylov@customsolutions.info";

export default function Admin() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "denied" | "ready" | "no_client_id"
  >(CLIENT_ID ? "idle" : "no_client_id");
  const [rows, setRows] = useState<VisitRow[]>([]);
  const [rawCsv, setRawCsv] = useState("");
  const [error, setError] = useState("");

  const fetchVisits = useCallback(async (token: string) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/visits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        setStatus("denied");
        setError("Access denied. Only the authorised account may view this page.");
        return;
      }
      if (!res.ok) throw new Error("Server error");
      const data = (await res.json()) as { csv: string };
      setRawCsv(data.csv);
      setRows(parseCSV(data.csv));
      setStatus("ready");
    } catch {
      setError("Failed to load visits. Check that the API server is running.");
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (!CLIENT_ID) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: ({ credential }) => {
          fetchVisits(credential);
        },
      });
      const btn = document.getElementById("google-signin-btn");
      if (btn) {
        window.google?.accounts.id.renderButton(btn, {
          theme: "filled_black",
          size: "large",
          type: "standard",
          text: "signin_with",
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [fetchVisits]);

  const downloadCsv = () => {
    const blob = new Blob([rawCsv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "operon-visitors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold font-display mb-1">Operon AI — Visitor Admin</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Restricted to {ALLOWED_EMAIL}
        </p>

        {status === "no_client_id" && (
          <div className="glass-card rounded-2xl p-8 border border-yellow-500/30 bg-yellow-500/5">
            <h2 className="text-yellow-400 font-semibold mb-2">Setup required</h2>
            <p className="text-muted-foreground text-sm mb-3">
              Add your Google OAuth Client ID as an environment variable:
            </p>
            <code className="block bg-black/40 rounded px-4 py-3 text-xs text-primary mb-3">
              VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
            </code>
            <p className="text-muted-foreground text-xs">
              Create it at{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                console.cloud.google.com/apis/credentials
              </a>{" "}
              → OAuth 2.0 Client ID → Web application. Add your domain to
              Authorized JavaScript origins.
            </p>
          </div>
        )}

        {status === "idle" && CLIENT_ID && (
          <div className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4">
            <p className="text-muted-foreground mb-2">Sign in with your Google account to continue</p>
            <div id="google-signin-btn" data-testid="google-signin-btn" />
          </div>
        )}

        {status === "loading" && (
          <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
            Verifying access…
          </div>
        )}

        {status === "denied" && (
          <div className="glass-card rounded-2xl p-10 text-center border border-red-500/30 bg-red-500/5">
            <p className="text-red-400 font-semibold mb-1">Access denied</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        )}

        {status === "ready" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {rows.length} visit{rows.length !== 1 ? "s" : ""} recorded
              </span>
              <Button
                size="sm"
                onClick={downloadCsv}
                data-testid="btn-download-csv"
                className="gap-2"
              >
                Download CSV
              </Button>
            </div>

            {rows.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
                No visits recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Time</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Client</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">IP</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">User Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        data-testid={`visit-row-${i}`}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-foreground/80">
                          {formatDate(row.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          {row.client ? (
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-mono">
                              {row.client}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-foreground/60 font-mono text-xs">
                          {row.ip || "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground/50 text-xs max-w-xs truncate">
                          {row.userAgent || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {error && status === "idle" && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
