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
}
