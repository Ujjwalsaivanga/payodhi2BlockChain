"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Activity,
  Network,
  BarChart3,
  Radio,
  GitCompare,
  FileDown,
  Layers,
  Terminal,
} from "lucide-react";
import { BackendStatus } from "./BackendStatus";

const DESTINATIONS = [
  { href: "/", label: "SOC Command", icon: Shield, badge: "LIVE" },
  { href: "/sessions", label: "Tunnels & SAs", icon: Layers, badge: "10" },
  { href: "/graph", label: "Peer Topology", icon: Network },
  { href: "/overview", label: "Threat Matrix", icon: BarChart3 },
  { href: "/live", label: "Packet Stream", icon: Radio },
  { href: "/compare", label: "Capture Diff", icon: GitCompare },
  { href: "/export", label: "Briefing Export", icon: FileDown },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-y-0 left-0 flex w-[var(--sidebar-width)] flex-col border-r border-separator bg-surface/90 backdrop-blur-xl z-20"
    >
      {/* Platform Emblem & Header */}
      <div className="flex h-[var(--toolbar-height)] items-center justify-between border-b border-separator px-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
            <Shield className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 radar-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-slate-100 text-sm">PAYODHI</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">NTRO</span>
            </div>
            <p className="text-[10px] text-label-secondary font-mono tracking-wider">SIH 26160</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-label-tertiary px-2.5 mb-1.5 font-semibold">
          Operations
        </p>
        <ul className="flex flex-col gap-1">
          {DESTINATIONS.map(({ href, label, icon: Icon, badge }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                    active
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${active ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        active
                          ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Cyber Telemetry Status */}
      <div className="mt-auto border-t border-separator p-3 bg-surface/50">
        <div className="mb-2.5 rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-2.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400 font-mono">SENSOR STATUS</span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
            <span>RFC 7296 PARSER</span>
            <span className="text-cyan-400">ACTIVE</span>
          </div>
        </div>
        <BackendStatus />
      </div>
    </nav>
  );
}
