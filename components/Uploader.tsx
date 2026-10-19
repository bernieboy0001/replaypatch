"use client";

import { useState, useRef } from "react";
import { AnalysisResult } from "../lib/types";
import Results from "./Results";
import Reveal from "./Reveal";

function Mark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7l5 5 3-3 3 3 5-5"
        stroke="url(#mg)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="mg" x1="4" y1="7" x2="20" y2="7">
          <stop stopColor="#ffb547" />
          <stop offset="1" stopColor="#ff7a18" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconRecord() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconTest() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

function IconPatch() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 3.5a4.24 4.24 0 016 6l-8.5 8.5a2 2 0 01-.7.47l-4.47 1.53a.5.5 0 01-.63-.63l1.53-4.47a2 2 0 01.47-.7z" />
      <path d="M12 6l6 6" />
    </svg>
  );
}

function IconChain() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h6" />
      <path d="M11 7l1.5-1.5a4.24 4.24 0 016 6L17 13" />
      <path d="M13 17l-1.5 1.5a4.24 4.24 0 01-6-6L7 11" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

const GH_URL = "https://github.com/bernieboy0001/replaypatch/blob/midnight-wave2/contracts/compact/qa-attestation.compact";

function ChainHash({ label, hash, url }: { label: string; hash: string; url: string }) {
  return (
    <div className="chain-row">
      <IconShield />
      <span className="label">{label}</span>
      <span className="hash">{hash.length > 20 ? hash.slice(0, 20) + "…" : hash}</span>
      <a href={url} target="_blank" rel="noopener noreferrer">
        view on GitHub ↗
      </a>
    </div>
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
      <nav className="nav">
        <div className="brand">
          <div className="mark-frame">
            <Mark />
          </div>
          <div className="name">
            Replay<b>Patch</b>
          </div>
        </div>
        <div className="nav-right">
          <a
            className="link-btn"
            href="https://github.com/bernieboy0001/replaypatch"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.35-3.87-1.35-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 015.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
            GitHub
          </a>
          <div className={"pill " + (result ? (result.demo ? "demo" : "live") : "")}>
            {result ? (result.demo ? "DEMO MODE" : "LIVE") : "WAVE 2"}
          </div>
        </div>
      </nav>

      <header className="hero">
        <Reveal>
          <span className="eyebrow">
            <span className="dot" />
            Autonomous QA · Built for Midnight
          </span>
          <h1>
            Turn a bug video into <span className="hl">a verified pull request.</span>
          </h1>
          <p className="sub">
            Drop a screen recording of a broken flow. ReplayPatch reconstructs the repro steps with{" "}
            <span className="accent">GPT-5.5</span>, writes a Playwright test that catches it, patches
            the source, reruns to green — and records a content-hiding attestation on{" "}
            <span className="accent">Midnight</span>.
          </p>
          <div className="hero-chips">
            <span className="chip-line">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M4 12l5 5L20 6" />
              </svg>
              Failing test reproduced
            </span>
            <span className="chip-line">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M4 12l5 5L20 6" />
              </svg>
              Fix verified on rerun
            </span>
            <span className="chip-line">
              <b>▣ Midnight</b> content-hiding attestation
            </span>
          </div>
        </Reveal>
      </header>

      <Reveal delay={80}>
        <div
          className={"dropzone" + (drag ? " drag" : "")}
          onClick={() => !loading && inputRef.current?.click()}
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
          <div className="dropzone-label">
            <span className="rec" />
            New bug report
          </div>
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
          <div className="dz-title">{file ? "Recording attached" : "Drop a screen recording or click to browse"}</div>
          {!file && <div className="dz-sub">MP4 · WebM · MOV — the recording becomes an executable test</div>}
          {file && (
            <div className="dz-meta">
              <div className="dz-file">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M13 2L4 12h6l-1 8 9-12h-6l1-6z" fill="currentColor" stroke="none" />
                </svg>
                <span>{file.name}</span>
                <span style={{ opacity: 0.7 }}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <button
                className="dz-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                remove
              </button>
            </div>
          )}
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
                Watching frames · writing test · patching…
              </>
            ) : (
              "Replay the bug →"
            )}
          </button>
        </div>
      </Reveal>

      {error && <p className="err">{error}</p>}

      {!result && (
        <p className="note">
          No OpenAI key? It runs in <b>demo mode</b> against a bundled sample bug — no API calls
          required. Add <code>OPENAI_API_KEY</code> to <code>.env</code> for live vision analysis.
        </p>
      )}

      {result && <Results result={result} />}

      {!result && (
        <>
          <section className="section" style={{ marginTop: result ? 24 : 78 }}>
            <Reveal>
              <div className="section-head">
                <div className="kicker">How it works</div>
                <h2>From recording to on-chain proof</h2>
                <p>Four stages, zero hand-holding. Every artifact is real and inspectable.</p>
              </div>
            </Reveal>
            <div className="steps-grid">
              {[
                {
                  icon: <IconRecord />,
                  cls: "is-0",
                  step: "01",
                  title: "Record",
                  text: "Screen-record the broken flow and drop the clip. The video is your bug report.",
                },
                {
                  icon: <IconTest />,
                  cls: "",
                  step: "02",
                  title: "Test",
                  text: "GPT-5.5 watches the frames and writes a Playwright test that reproduces the bug. It runs red — proof it's real.",
                },
                {
                  icon: <IconPatch />,
                  cls: "is-2",
                  step: "03",
                  title: "Patch",
                  text: "The model reads the failing output and source, writes the fix, and reruns the same test to green.",
                },
                {
                  icon: <IconChain />,
                  cls: "is-3",
                  step: "04",
                  title: "On Midnight",
                  text: "The Compact QA Attestation contract binds recording hash, patch hash and verdict into a hiding commitment — proof goes on-chain, content never does.",
                },
              ].map((s, i) => (
                <div className={"step-card " + s.cls} key={s.step} style={{ position: "relative" }}>
                  {i < 3 && <span className="step-arrow">→</span>}
                  <div className="step-icon">{s.icon}</div>
                  <div className="step-num">{s.step}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </section>

          <Reveal>
            <div className="chain-band">
              <div className="chain-band-top">
                <div className="chain-title">
                  <span className="shield">
                    <IconShield />
                  </span>
                  Content-hiding attestations on Midnight
                </div>
                <span className="chain-status">● COMPACT 0.31.1 · LANG 0.23</span>
              </div>
              <div className="chain-rows">
                <div className="chain-row">
                  <IconShield />
                  <span className="label">QA Attestation contract</span>
                  <span className="hash">qa-attestation.compact</span>
                  <a href={GH_URL} target="_blank" rel="noopener noreferrer">
                    view on GitHub ↗
                  </a>
                </div>
                <ChainHash label="attest() circuit" hash="content-hiding commitment" url={GH_URL} />
                <ChainHash label="verify() circuit" hash="ZK proof, no reveal" url={GH_URL} />
              </div>
              <p className="chain-note">
                Every bug fix ReplayPatch ships produces a hiding commitment on Midnight —
                recording hash, patch hash and verdict are bound together, the reporter stays
                pseudonymous, and the evidence itself never leaves your machine. Auditable
                without leaking the bug.
              </p>
            </div>
          </Reveal>
        </>
      )}

      <footer className="footer">
        <div className="f-left">
          Replay<b>Patch</b> · AI QA you can audit
          <span style={{ opacity: 0.5 }}>· for Midnight Buildathon by AKINDO</span>
        </div>
        <div className="f-right">
          <a href="https://docs.midnight.network/" target="_blank" rel="noopener noreferrer">
            Midnight
          </a>
          <a href="https://github.com/bernieboy0001/replaypatch" target="_blank" rel="noopener noreferrer">
            Source
          </a>
        </div>
      </footer>
    </>
  );
}