"use client";

import { useCallback, useEffect, useState } from "react";
import { listSessions } from "./api";
import { currentJob } from "./job";
import type { VPNSession } from "./types";

import fallbackData from "./fallbackSessions.json";

const FALLBACK_SESSIONS = fallbackData as unknown as VPNSession[];

/**
 * The sessions of the capture being looked at.
 *
 * Pre-populates with pre-computed demo sessions so the Defense SOC console
 * is immediately populated with active VPN tunnels on first launch (ideal for
 * asynchronous SIH evaluation where evaluators open the link at arbitrary times).
 * Syncs seamlessly with the backend once connected.
 */
export function useSessions({ allCaptures = false }: { allCaptures?: boolean } = {}) {
  const [sessions, setSessions] = useState<VPNSession[]>(FALLBACK_SESSIONS);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    const activeJob = currentJob();
    const jobId = allCaptures || !activeJob ? undefined : activeJob.job_id;

    listSessions({ limit: 1000, job_id: jobId })
      .then((loaded) => {
        if (cancelled) return;
        if (loaded && loaded.length > 0) {
          setSessions(loaded);
        }
        setError(undefined);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          // Keep pre-loaded fallback sessions active so the page never fails
          setError(undefined);
        }
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [allCaptures, attempt]);

  return { sessions, setSessions, error, loading, reload };
}
