"use client";
import { useEffect, useState } from "react";

export default function SmokeTest() {
  const [kpis, setKpis] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [k, s] = await Promise.all([
          fetch("/api/kpis").then(r => r.json()),
          fetch("/api/segments/summary").then(r => r.json()),
        ]);
        setKpis(k);
        setSummary(Array.isArray(s) ? s.slice(0, 3) : s);
      } catch (e: any) {
        setErr(e?.message ?? "erro");
      }
    })();
  }, []);

  if (err) return <div style={{ color: "red" }}>Smoke erro: {err}</div>;

  return (
    <div style={{ fontSize: 12, marginTop: 16, padding: 12, border: "1px dashed #999", borderRadius: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>SmokeTest (debug)</div>
      <div style={{ display: "grid", gap: 8 }}>
        <pre>{JSON.stringify(kpis, null, 2)}</pre>
        <pre>{JSON.stringify(summary, null, 2)}</pre>
      </div>
    </div>
  );
}
