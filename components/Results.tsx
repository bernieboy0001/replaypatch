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
      {copied ? "copied" : "copy"}
    </button>
  );
}

function Code({ fname, code, term, diff }: { fname: string; code: string; term?: boolean; diff?: boolean }) {
  return (
    <div className="codewrap">
      <div className="codebar">
        <span className="fname">{fname}</span>
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
  const mark = status === "ok" ? "✓" : status === "bad" ? "✗" : status === "run" ? "▸" : "•";
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

export default function Results({ result }: { result: AnalysisResult }) {
  return (
    <div className="pipeline">
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="body-text">
              <b style={{ color: "var(--text)" }}>Recording hash:</b>{" "}
              <code style={{ color: "var(--accent-2)", fontFamily: "var(--mono)" }}>
                {result.ogProof.recordingHash.slice(0, 18)}…
              </code>
            </div>
            <div className="body-text">
              <b style={{ color: "var(--text)" }}>Report tx:</b>{" "}
              <a
                href={result.ogProof.explorerUrl.replace("/tx/" + result.ogProof.verifyTxHash, "/tx/" + result.ogProof.reportTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--blue)" }}
              >
                {result.ogProof.reportTxHash.slice(0, 18)}…
              </a>
            </div>
            <div className="body-text">
              <b style={{ color: "var(--text)" }}>Verify tx:</b>{" "}
              <a
                href={result.ogProof.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--green)" }}
              >
                {result.ogProof.verifyTxHash?.slice(0, 18)}…
              </a>
            </div>
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
