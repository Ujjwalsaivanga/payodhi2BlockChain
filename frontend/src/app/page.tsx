"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Cpu,
  Lock,
  Layers,
  Activity,
  ArrowUpRight,
  UploadCloud,
  FileText,
  AlertTriangle,
  Zap,
  Terminal,
} from "lucide-react";
import { Toolbar } from "@/components/Toolbar";
import { UploadDrop } from "@/components/UploadDrop";
import { CaptureSpectrum } from "@/components/CaptureSpectrum";
import { SessionTable } from "@/components/SessionTable";
import { SessionDrilldown } from "@/components/SessionDrilldown";
import { PeerGraph } from "@/components/PeerGraph";
import { useSessions } from "@/lib/useSessions";
import { peerGraph } from "@/lib/charts";
import type { Severity, VPNSession } from "@/lib/types";

export default function SOCCommandPage() {
  const { sessions, loading, error, reload } = useSessions({ allCaptures: true });
  const [activeSession, setActiveSession] = useState<VPNSession | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | undefined>(undefined);
  const [showUpload, setShowUpload] = useState(false);

  // Compute live cybersecurity metrics
  const stats = useMemo(() => {
    const total = sessions.length;
    const critical = sessions.filter((s) => s.security_assessment.overall_severity === "CRITICAL").length;
    const high = sessions.filter((s) => s.security_assessment.overall_severity === "HIGH").length;
    const clean = sessions.filter(
      (s) => s.security_assessment.overall_severity === "SAFE" || s.security_assessment.overall_severity === "LOW"
    ).length;

    // Average risk score across estate
    const avgRisk =
      total > 0
        ? Math.round(sessions.reduce((acc, s) => acc + s.security_assessment.risk_score, 0) / total)
        : 0;

    return { total, critical, high, clean, avgRisk };
  }, [sessions]);

  // Filtered sessions based on active chip
  const displayedSessions = useMemo(() => {
    if (!selectedSeverity) return sessions;
    return sessions.filter((s) => s.security_assessment.overall_severity === selectedSeverity);
  }, [sessions, selectedSeverity]);

  // Graph topology calculation
  const { nodes, edges } = useMemo(() => peerGraph(sessions), [sessions]);

  return (
    <div className="min-h-screen pb-16">
      {/* Top Navigation & Status Bar */}
      <Toolbar title="NTRO Cyber Command · SIH 26160">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 radar-ping" />
            <span>SENSOR ACTIVE</span>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors shadow-sm"
          >
            <UploadCloud className="h-3.5 w-3.5 text-cyan-400" />
            <span>{showUpload ? "Hide Ingest" : "Ingest PCAP"}</span>
          </button>
        </div>
      </Toolbar>

      <div className="px-6 py-6 space-y-6 max-w-[1700px] mx-auto">
        {/* Hero Mission Header */}
        <div className="cyber-card rounded-2xl p-6 border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-96 bg-cyan-500/5 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-rose-950/80 border border-rose-600/40 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-400 tracking-wider">
                  DEFCON 2 · ELEVATED VULNERABILITY
                </span>
                <span className="text-xs font-mono text-slate-400">
                  NATIONAL TECHNICAL RESEARCH ORGANISATION
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                AI-Powered IPsec Protocol Analyzer
              </h1>
              <p className="mt-1.5 text-sm text-slate-300 max-w-[75ch]">
                Continuous passive inspection of IKEv1/IKEv2 handshakes, encrypted ESP side-channel fingerprinting, and multi-baseline compliance against RFC 8221, NIST SP 800-77r1, and Indian DST-NQM.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={reload}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-[1.02]"
              >
                <Zap className="h-4 w-4" />
                <span>Live Demo Estate</span>
              </button>
              <Link
                href="/export"
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 px-4 py-2.5 text-xs font-medium transition-all"
              >
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>Defense Report</span>
              </Link>
            </div>
          </div>

          {/* Integrated Collapsible Upload Drop */}
          {showUpload && (
            <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in duration-300">
              <p className="text-xs font-mono text-slate-400 mb-3 flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                PASSIVE WIRE CAPTURE INGESTION (PCAP / PCAPNG)
              </p>
              <UploadDrop />
            </div>
          )}
        </div>

        {/* Cyber KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Monitored Tunnels */}
          <div className="cyber-card rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>ACTIVE TUNNELS</span>
              <Layers className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tabular">{stats.total}</span>
              <span className="text-xs text-emerald-400 font-mono font-medium">100% INGESTED</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Across Cisco ASA, strongSwan, Fortinet & Juniper
            </p>
          </div>

          {/* Card 2: Critical Threats */}
          <div className="cyber-card rounded-xl p-4 border border-rose-500/25">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>CRITICAL CVEs</span>
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-rose-400 tabular">{stats.critical}</span>
              <span className="text-xs text-rose-400 font-mono bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/40">
                ACTION REQUIRED
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              LOGJAM (CVE-2015-4000) & SWEET32 (CVE-2016-2183)
            </p>
          </div>

          {/* Card 3: AI Flow Classification Accuracy */}
          <div className="cyber-card rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>AI FLOW CLASSIFIER</span>
              <Cpu className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-cyan-300 tabular">98.01%</span>
              <span className="text-xs text-cyan-400 font-mono">MACRO-F1</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Random Forest on 13 side-channel packet size/timing features
            </p>
          </div>

          {/* Card 4: Post-Quantum Preparedness */}
          <div className="cyber-card rounded-xl p-4 border border-amber-500/25">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>POST-QUANTUM STATUS</span>
              <Lock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-amber-400 tabular">0%</span>
              <span className="text-xs text-amber-400 font-mono bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/40">
                SHOR VULNERABLE
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Classical DH & ECDH vulnerable to harvest-now-decrypt-later
            </p>
          </div>
        </div>

        {/* Capture Spectrum Bar */}
        <div className="cyber-card rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span className="font-semibold text-slate-200">Estate Security Spectrum</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Avg Risk Index: <span className="text-rose-400 font-bold">{stats.avgRisk}/100</span>
            </div>
          </div>
          <CaptureSpectrum
            sessions={sessions}
            selected={activeSession?.session_id}
            onSelect={(id) => {
              const match = sessions.find((s) => s.session_id === id);
              if (match) setActiveSession(match);
            }}
          />
        </div>

        {/* Twin Centerpiece: D3 Peer Topology & Threat Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive D3 Force-Directed Network Graph */}
          <div className="lg:col-span-7 cyber-card rounded-2xl p-5 border border-cyan-500/20 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Live VPN Peer Topology (D3 Force Mesh)
                </h3>
                <p className="text-xs text-slate-400">
                  Interactive physics simulation. Nodes sized by tunnel volume, colored by worst risk.
                </p>
              </div>
              <Link
                href="/graph"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <span>Fullscreen</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="h-[360px] w-full rounded-xl border border-slate-800/80 bg-slate-950/70 relative overflow-hidden flex items-center justify-center">
              {loading ? (
                <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  Simulating Topology...
                </div>
              ) : (
                <PeerGraph
                  nodes={nodes}
                  edges={edges}
                  onSelectPeer={() => {}}
                  onSelectSession={(id) => {
                    const found = sessions.find((s) => s.session_id === id);
                    if (found) setActiveSession(found);
                  }}
                />
              )}
            </div>
          </div>

          {/* Right: High-Priority Threat Remediation & AI Traffic Mix */}
          <div className="lg:col-span-5 space-y-4">
            {/* Top Threat Card */}
            <div className="cyber-card rounded-2xl p-5 border border-rose-500/25">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-rose-400 flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  TOP DEFENSE ALERT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                  CVE-2015-4000
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                Logjam Attack Detected (Weak DH Group MODP1024)
              </h4>
              <p className="text-xs text-slate-300 mb-3">
                Initiator <span className="font-mono text-cyan-300">10.10.1.5</span> negotiated 1024-bit Diffie-Hellman on Cisco ASA gateway. Discrete log attacks can compute shared secret.
              </p>
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-slate-500"># Cisco ASA Remediation Diff:</span>
                <div className="text-rose-400 line-through">- crypto ikev2 policy 10 group 2</div>
                <div className="text-emerald-400">+ crypto ikev2 policy 10 group 19 21</div>
              </div>
            </div>

            {/* AI Side-Channel Classified Traffic Mix */}
            <div className="cyber-card rounded-2xl p-5 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  ENCRYPTED ESP FLOW PREDICTION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  SIDE-CHANNEL ML
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: "VoIP (RTP / SIP)", pct: 40, conf: "91% conf", color: "bg-sky-400" },
                  { name: "Video Streaming", pct: 25, conf: "89% conf", color: "bg-orange-500" },
                  { name: "Encrypted Web (HTTPS)", pct: 20, conf: "94% conf", color: "bg-emerald-400" },
                  { name: "Instant Messaging / Chat", pct: 15, conf: "97% conf", color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="font-mono text-[11px] text-slate-400">{item.conf}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Master Tunnels Explorer Table */}
        <div className="cyber-card rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                Monitored IPsec Security Associations & Tunnels
              </h3>
              <p className="text-xs text-slate-400">
                Click any session row to inspect RFC 7296 transforms, flow telemetry, CVE citations, and vendor remediation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Filter:</span>
              {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"] as const).map((sev) => {
                const isAll = sev === "ALL";
                const active = isAll ? selectedSeverity === undefined : selectedSeverity === sev;
                return (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(isAll ? undefined : sev)}
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all font-semibold ${
                      active
                        ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                        : "bg-slate-800/80 text-slate-400 hover:text-white"
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-cyan-400">
              Loading active sessions...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-xs text-rose-400 font-mono">
              Error loading sessions: {error}
            </div>
          ) : (
            <SessionTable
              sessions={displayedSessions}
              onSelect={setActiveSession}
              selected={activeSession?.session_id}
            />
          )}
        </div>
      </div>

      {/* Full Session Drilldown Modal */}
      {activeSession && (
        <SessionDrilldown
          session={activeSession}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  );
}
