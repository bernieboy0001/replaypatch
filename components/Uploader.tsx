"use client";

import { useState, useRef } from "react";
import { AnalysisResult } from "@/lib/types";
import Results from "./Results";

function Mark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7l5 5 3-3 3 3 5-5"
        stroke="#0a0b0f"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="6" r="2.1" fill="#0a0b0f" />
    </svg>
  );
}

export default function Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("video", file);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="nav">
        <div className="brand">
          <div className="mark">
            <Mark />
          </div>
          <div className="name">
            Replay<b>Patch</b>
          </div>
        </div>
        <div className={"pill " + (result ? (result.demo ? "demo" : "live") : "")}>
          {result ? (result.demo ? "DEMO MODE" : "LIVE") : "v0.1"}
        </div>
      </div>

      <div className="hero">
        <span className="eyebrow">◆ QA, but autonomous</span>
        <h1>Turn a bug video into a pull request.</h1>
        <p className="sub">
          Drop a screen recording of a broken flow. ReplayPatch watches the frames with{" "}
          <span className="accent">GPT-5.5</span>, writes a Playwright test that reproduces it,
          patches the source, and reruns to green — so every bug report becomes a permanent
          regression test.
        </p>
      </div>

      <div
        className={"dropzone" + (drag ? " drag" : "")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) setFile(f);
        }}
      >
        <div className="dz-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4m0 0L7 9m5-5l5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="dz-title">
          {file ? file.name : "Drop a screen recording or click to browse"}
        </div>
        <div className="dz-sub">MP4, WebM, MOV — the recording becomes an executable test</div>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          className="btn"
          onClick={(e) => {
            e.stopPropagation();
            submit();
          }}
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <span className="spin" />
              Analyzing…
            </>
          ) : (
            "Replay the bug →"
          )}
        </button>
      </div>

      {error && <p className="err">{error}</p>}

      {!result && (
        <p className="note">
          No OpenAI key? It runs in <b>demo mode</b> against a bundled sample bug — no API calls
          required. Add <code>OPENAI_API_KEY</code> to <code>.env</code> for live vision analysis.
        </p>
      )}

      {result && <Results result={result} />}
    </>
  );
}
