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
    </div>
  );
}
