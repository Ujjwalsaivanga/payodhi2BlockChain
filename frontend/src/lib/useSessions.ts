"use client";

import { useCallback, useEffect, useState } from "react";
import { listSessions } from "./api";
import { currentJob } from "./job";
import type { VPNSession } from "./types";

/**
 * The sessions of the capture being looked at.
 *
 * Scoped to the most recent ingest if present, otherwise gracefully defaults
 * to the pre-seeded demo database so the console is immediately populated with
 * active VPN tunnels on first launch.
 */
export function useSessions({ allCaptures = false }: { allCaptures?: boolean } = {}) {
  const [sessions, setSessions] = useState<VPNSession[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    const activeJob = currentJob();
    const jobId = allCaptures || !activeJob ? undefined : activeJob.job_id;

    listSessions({ limit: 1000, job_id: jobId })
      .then((loaded) => {
        if (cancelled) return;
        setSessions(loaded);
        setError(undefined);
      })
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [allCaptures, attempt]);

  return { sessions, setSessions, error, loading, reload };
}
