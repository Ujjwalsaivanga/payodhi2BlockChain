"use client";

import { useState } from "react";
import { SessionDrilldown } from "@/components/SessionDrilldown";
import { SessionTable } from "@/components/SessionTable";
import { Toolbar } from "@/components/Toolbar";
import { diffJobs, reconcileConfig, type ReconcileResponse } from "@/lib/api";
import { SEVERITY_HEX } from "@/lib/charts";
import { jobHistory } from "@/lib/job";
import type { SessionDiff, VPNSession } from "@/lib/types";

const control =
  "rounded-md border border-separator bg-surface-raised px-2.5 py-1.5 text-[length:var(--text-footnote)] text-label";

const SWANCTL_SAMPLE = `connections {
  gw-defense-tunnel {
    local_addrs = 192.168.1.1
    remote_addrs = 192.168.1.2
    version = 2
    proposals = aes256gcm16-sha256-modp2048
  }
}`;

export default function ComparePage() {
  const [tab, setTab] = useState<"pcap" | "config">("pcap");
  const history = typeof window === "undefined" ? [] : jobHistory();
  const [base, setBase] = useState(() => history[1]?.job_id ?? "");
  const [compare, setCompare] = useState(() => history[0]?.job_id ?? "");
  const [result, setResult] = useState<SessionDiff>();
  const [open, setOpen] = useState<VPNSession | null>(null);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  // Config Reconciler State
  const [configText, setConfigText] = useState(SWANCTL_SAMPLE);
  const [reconcileResult, setReconcileResult] = useState<ReconcileResponse | null>(null);
  const [reconcileBusy, setReconcileBusy] = useState(false);
  const [reconcileError, setReconcileError] = useState<string>();

  async function run() {
    setBusy(true);
    setError(undefined);
    try {
      setResult(await diffJobs(base, compare));
    } catch (e) {
      setError((e as Error).message);
      setResult(undefined);
    } finally {
      setBusy(false);
    }
  }

  async function handleReconcile() {
    setReconcileBusy(true);
    setReconcileError(undefined);
    try {
      const res = await reconcileConfig(configText);
      setReconcileResult(res);
    } catch (e) {
      setReconcileError((e as Error).message);
      setReconcileResult(null);
    } finally {
      setReconcileBusy(false);
    }
  }

  const options = history.map((job) => (
    <option key={job.job_id} value={job.job_id}>
      {job.capture_file} · {job.session_count} sessions
    </option>
  ));

  return (
    <div className="flex h-screen flex-col">
      <Toolbar title="Compare & Reconcile" />
      <div className="border-b border-separator bg-surface-raised/40 px-7 py-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("pcap")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              tab === "pcap"
                ? "bg-accent text-white shadow-sm"
                : "text-label-secondary hover:bg-surface-raised hover:text-label"
            }`}
          >
            PCAP Capture Diff (Time Series)
          </button>
          <button
            onClick={() => setTab("config")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              tab === "config"
                ? "bg-accent text-white shadow-sm"
                : "text-label-secondary hover:bg-surface-raised hover:text-label"
            }`}
          >
            Config-to-Wire Reconciler (Policy vs Wire)
          </button>
        </div>
      </div>

      <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        <div className="w-0 flex-1 overflow-y-auto px-7 py-6">
          {tab === "config" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-label">
                  Config-to-Wire Policy Reconciliation
                </h2>
                <p className="mt-1 text-xs text-label-secondary">
                  Compare intended VPN security policy (strongSwan <code className="font-mono text-accent">swanctl.conf</code> or <code className="font-mono text-accent">ipsec.conf</code>) against the actual negotiated parameters observed on the wire.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-label-secondary">
                    Configuration File Contents
                  </label>
                  <button
                    onClick={() => setConfigText(SWANCTL_SAMPLE)}
                    className="text-xs text-accent hover:underline"
                  >
                    Reset to strongSwan Template
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={configText}
                  onChange={(e) => setConfigText(e.target.value)}
                  className="w-full font-mono text-xs rounded-lg border border-separator bg-surface-raised p-3 text-label focus:border-accent focus:outline-none"
                  placeholder="Paste swanctl.conf or ipsec.conf syntax here..."
                />
                <button
                  onClick={handleReconcile}
                  disabled={reconcileBusy || !configText.trim()}
                  className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                >
                  {reconcileBusy ? "Reconciling..." : "Reconcile Policy vs. Wire"}
                </button>
              </div>

              {reconcileError && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                  {reconcileError}
                </div>
              )}

              {reconcileResult && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-label-secondary">Detected Format:</span>
                    <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-xs font-medium text-accent border border-accent/20">
                      {reconcileResult.format || "unknown"}
                    </span>
                    <span className="text-xs text-label-tertiary">
                      · {reconcileResult.tunnels_count} tunnel(s) evaluated
                    </span>
                  </div>

                  {reconcileResult.reconciliations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-separator bg-surface-raised/40 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-separator/60 pb-2">
                        <span className="font-mono text-xs font-semibold text-label">
                          {rec.tunnel_name}
                        </span>
                        <span className="font-mono text-[11px] text-label-tertiary">
                          Session {rec.session_id} ({rec.initiator_ip} ↔ {rec.responder_ip})
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-separator/40 text-[11px] text-label-tertiary">
                              <th className="py-1.5 font-medium">Field</th>
                              <th className="py-1.5 font-medium">Outcome</th>
                              <th className="py-1.5 font-medium">Config Policy</th>
                              <th className="py-1.5 font-medium">Wire Observed</th>
                              <th className="py-1.5 font-medium">Audit Note</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-separator/20 font-mono text-[11px]">
                            {rec.comparisons.map((c, cIdx) => {
                              const outcome = c.outcome.toLowerCase();
                              const badgeColor =
                                outcome === "match"
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : outcome === "mismatch"
                                  ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                  : outcome === "consistent"
                                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                                  : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";

                              return (
                                <tr key={cIdx} className="hover:bg-surface-raised/60">
                                  <td className="py-2 text-label font-medium">{c.field}</td>
                                  <td className="py-2">
                                    <span
                                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold border ${badgeColor}`}
                                    >
                                      {c.outcome.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-2 text-label-secondary truncate max-w-[180px]">
                                    {Array.isArray(c.config)
                                      ? c.config.join(", ")
                                      : String(c.config ?? "none")}
                                  </td>
                                  <td className="py-2 text-label truncate max-w-[180px]">
                                    {String(c.wire ?? "none")}
                                  </td>
                                  <td className="py-2 text-[11px] font-sans text-label-tertiary">
                                    {c.note}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {history.length < 2 ? (
                <p className="py-24 text-center text-[length:var(--text-subhead)] text-label-secondary">
                  Analyse two captures to compare them. One is in; one to go.
                </p>
              ) : (
                <>
                  <p className="max-w-[62ch] text-[length:var(--text-footnote)] text-label-secondary">
                    Compare a later capture against an earlier one to see which sessions appeared, which
                    went away, and which got worse.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[length:var(--text-footnote)] text-label-secondary">
                    <label className="flex items-center gap-2">
                      Earlier
                      <select
                        data-testid="diff-base"
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        className={control}
                      >
                        {options}
                      </select>
                    </label>
                    <label className="flex items-center gap-2">
                      Later
                      <select
                        data-testid="diff-compare"
                        value={compare}
                        onChange={(e) => setCompare(e.target.value)}
                        className={control}
                      >
                        {options}
                      </select>
                    </label>
                    <button
                      data-testid="diff-run"
                      type="button"
                      disabled={busy || !base || !compare || base === compare}
                      onClick={run}
                      className="rounded-md bg-accent px-3 py-1.5 text-[length:var(--text-footnote)] font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                    >
                      {busy ? "Comparing..." : "Compare"}
                    </button>
                    {base === compare && (
                      <span className="text-label-tertiary">Pick two different captures.</span>
                    )}
                  </div>

                  {error && (
                    <p className="mt-3 text-[length:var(--text-footnote)] text-system-critical">
                      {error}
                    </p>
                  )}

                  {result && (
                    <div className="mt-6 space-y-6">
                      <Section
                        id="added"
                        title="New sessions"
                        note="Sessions present in the later capture that were not in the earlier one."
                        count={result.added.length}
                      >
                        <SessionTable sessions={result.added} onSelect={setOpen} />
                      </Section>

                      <Section
                        id="removed"
                        title="Gone sessions"
                        note="Sessions in the earlier capture that did not appear in the later one."
                        count={result.removed.length}
                      >
                        <SessionTable sessions={result.removed} onSelect={setOpen} />
                      </Section>

                      <Section
                        id="degraded"
                        title="Degraded sessions"
                        note="Sessions whose risk score got worse between captures."
                        count={result.degraded.length}
                      >
                        <table className="w-full text-left text-[length:var(--text-footnote)]">
                          <thead>
                            <tr className="border-b border-separator text-label-secondary">
                              <th className="py-2 pr-4 font-medium">Session</th>
                              <th className="py-2 pr-4 font-medium">Severity</th>
                              <th className="py-2 pr-4 font-medium">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.degraded.map((row) => (
                              <tr
                                key={row.session_id}
                                onClick={() => setOpen(row.compare)}
                                className="cursor-pointer border-b border-separator/50 hover:bg-surface-raised"
                              >
                                <td className="font-mono py-2.5 pr-4 text-label">{row.session_id}</td>
                                <td
                                  className="tabular py-2.5 pr-4 font-medium"
                                  style={{ color: SEVERITY_HEX[row.compare_severity] }}
                                >
                                  {row.compare_severity}
                                </td>
                                <td className="tabular py-2.5 pr-4">
                                  {row.base_score} → {row.compare_score}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Section>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        {open && <SessionDrilldown session={open} onClose={() => setOpen(null)} />}
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  note,
  count,
  children,
}: {
  id: string;
  title: string;
  note: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section data-testid={`diff-${id}`}>
      <h2 className="text-[length:var(--text-headline)] font-semibold tracking-tight">
        {title}
        <span className="tabular ml-2 text-label-tertiary">{count}</span>
      </h2>
      <p className="mt-1 text-[length:var(--text-footnote)] text-label-secondary">{note}</p>
      <div className="mt-3 w-full min-w-0 overflow-x-auto">
        {count === 0 ? (
          <p className="py-6 text-[length:var(--text-footnote)] text-label-tertiary">
            Nothing here — which is the good outcome.
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
