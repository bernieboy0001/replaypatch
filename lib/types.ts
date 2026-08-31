export interface ReproStep {
  action: "click" | "type" | "navigate" | "hover" | "wait" | "assert" | "other";
  description: string;
  selector?: string;
  value?: string;
}

export interface AnalysisRequest {
  videoPath: string;
  framePaths: string[];
  targetUrl: string;
  targetRepo: string;
}

export interface PatchResult {
  path: string;
  before: string;
  after: string;
}

export interface OGProof {
  recordingHash: string;       // 0G Storage content hash
  reportId: string;            // on-chain report id
  reportTxHash: string;        // report() tx on 0G Chain
  verifyTxHash: string | null; // verify() tx on 0G Chain
  explorerUrl: string;         // link to 0G Explorer
}

export interface AnalysisResult {
  demo: boolean;
  frames: string[];
  summary: string;
  reproSteps: ReproStep[];
  expectedBehavior: string;
  testCode: string;
  testRun: {
    passed: boolean;
    output: string;
  };
  patch: PatchResult[] | null;
  rerun: {
    passed: boolean;
    output: string;
  } | null;
  prUrl: string | null;
  ogProof: OGProof | null;
}
