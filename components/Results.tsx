"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? "copied ✓" : "copy"}
    </button>
  );
}

function Code({ fname, code, term, diff }: { fname: string; code: string; term?: boolean; diff?: boolean }) {
  return (
    <div className="codewrap">
      <div className="codebar">
        <div className="codebar-left">
          <div className="dots">
            <i />
            <i />
            <i />
          </div>
          <span className="fname">{fname}</span>
          {term && <span className="tag">run</span>}
          {diff && <span className="tag" style={{ color: "var(--green)", background: "rgba(61,220,132,0.1)", borderColor: "rgba(61,220,132,0.3)" }}>patch</span>}
        </div>
        <CopyBtn text={code} />
      </div>
      <pre className={"code" + (term ? " term" : "") + (diff ? " diff" : "")}>{code}</pre>
    </div>
  );
}

function Stage({
  status,
  title,
  children,
}: {
  status: "ok" | "bad" | "run" | "plain";
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  const mark = status === "ok" ? "✓" : status === "bad" ? "✗" : status === "run" ? "→" : "·";
  return (
    <div className="stage">
      <div className={"marker " + (status === "plain" ? "" : status)}>{mark}</div>
      <div className="stage-body">
        <div className="stage-title">{title}</div>
        {children}
      </div>
    </div>
  );
}

function Verdict({ result }: { result: AnalysisResult }) {
  const fixed = result.rerun?.passed;
  return (
    <div className="verdict">
      <div className="v-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12l5 5L20 6" />
        </svg>
      </div>
      <div>
        <div className="v-title">{fixed ? "Bug fixed — fix verified" : "Analysis complete"}</div>
        <div className="v-sub">
          {fixed
            ? "The same test that caught the bug now passes after the patch."
            : result.demo
              ? "Demo run — sample-bug pipeline executed end to end."
              : "Pipeline ran against your recording."}
        </div>
      </div>
    </div>
  );
}

export default function Results({ result }: { result: AnalysisResult }) {
  return (
    <div className="pipeline">
      <Verdict result={result} />

      <Stage status="ok" title="Frames extracted">
        {result.frames.length > 0 ? (
          <div className="frames">
            {result.frames.map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={f} alt={`frame ${i}`} />
            ))}
          </div>
        ) : (
          <p className="body-text">Key frames pulled from the recording.</p>
        )}
      </Stage>

      <Stage status="ok" title="What the video shows">
        <p className="body-text">{result.summary}</p>
      </Stage>

      <Stage status="ok" title="Repro steps reconstructed">
        <ul className="steps">
          {result.reproSteps.map((s, i) => (
            <li key={i}>
              <span className="chip">{s.action}</span>
              <span>{s.description}</span>
              {s.selector ? <span className="sel">{s.selector}</span> : null}
            </li>
          ))}
        </ul>
        <p className="body-text" style={{ marginTop: 10 }}>
          <b style={{ color: "var(--text)" }}>Expected:</b> {result.expectedBehavior}
        </p>
      </Stage>

      <Stage status="run" title="Generated Playwright test">
        <Code fname="repro.mjs" code={result.testCode} />
      </Stage>

      <Stage
        status={result.testRun.passed ? "ok" : "bad"}
        title={
          result.testRun.passed ? (
            <>
              First run — <span className="ok">passes</span>
            </>
          ) : (
            <>
              First run — <span className="bad">reproduces the bug</span>
            </>
          )
        }
      >
        <Code fname="terminal" code={result.testRun.output || "(no output)"} term />
      </Stage>

      {result.patch && result.patch.length > 0 && (
        <Stage status="ok" title="Patch applied">
          {result.patch.map((f) => (
            <Code key={f.path} fname={f.path} code={f.after} diff />
          ))}
        </Stage>
      )}

      {result.rerun && (
        <Stage
          status={result.rerun.passed ? "ok" : "bad"}
          title={
            result.rerun.passed ? (
              <>
                Rerun — <span className="ok">fix verified ✓</span>
              </>
            ) : (
              <>
                Rerun — <span className="bad">still failing</span>
              </>
            )
          }
        >
          <Code fname="terminal" code={result.rerun.output || "(no output)"} term={!result.rerun.passed} />
        </Stage>
      )}

      {result.prUrl && (
        <p className="body-text" style={{ color: "var(--green)" }}>
          PR opened: <a href={result.prUrl}>{result.prUrl}</a>
        </p>
      )}

      {result.ogProof && (
        <Stage status="ok" title="Committed to 0G Chain">
          <div className="chain-rows">
            <div className="chain-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 12h6" />
                <path d="M11 7l1.5-1.5a4.24 4.24 0 016 6L17 13" />
                <path d="M13 17l-1.5 1.5a4.24 4.24 0 01-6-6L7 11" />
              </svg>
              <span className="label">Recording hash</span>
              <span className="hash">{result.ogProof.recordingHash.slice(0, 20)}…</span>
            </div>
            <div className="chain-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 12h6" />
                <path d="M11 7l1.5-1.5a4.24 4.24 0 016 6L17 13" />
                <path d="M13 17l-1.5 1.5a4.24 4.24 0 01-6-6L7 11" />
              </svg>
              <span className="label">Report tx</span>
              <span className="hash">{result.ogProof.reportTxHash.slice(0, 20)}…</span>
              <a
                href={result.ogProof.explorerUrl.replace("/tx/" + result.ogProof.verifyTxHash, "/tx/" + result.ogProof.reportTxHash)}
                target="_blank"
                rel="noopener noreferrer"
              >
                view on 0G Explorer ↗
              </a>
            </div>
            {result.ogProof.verifyTxHash && (
              <div className="chain-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 12h6" />
                  <path d="M11 7l1.5-1.5a4.24 4.24 0 016 6L17 13" />
                  <path d="M13 17l-1.5 1.5a4.24 4.24 0 01-6-6L7 11" />
                </svg>
                <span className="label">Verify tx</span>
                <span className="hash">{result.ogProof.verifyTxHash.slice(0, 20)}…</span>
                <a href={result.ogProof.explorerUrl} target="_blank" rel="noopener noreferrer">
                  view on 0G Explorer ↗
                </a>
              </div>
            )}
          </div>
        </Stage>
      )}

      {!result.ogProof && !result.demo && (
        <Stage status="plain" title="0G integration">
          <p className="body-text">
            Set <code>OG_CONTRACT_ADDRESS</code> and <code>OG_PRIVATE_KEY</code> in <code>.env</code> to store every verification on 0G Chain.
          </p>
        </Stage>
      )}
    </div>
  );
}