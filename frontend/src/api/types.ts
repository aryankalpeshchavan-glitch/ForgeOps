/**
 * Typed models for the ForgeOps backend API.
 * Every shape below was verified against the running FastAPI backend.
 */

/* ---------------------------------- Base --------------------------------- */

export interface ServiceInfo {
  name: string;
  status: string;
  version: string;
}

export interface HealthInfo {
  status: string;
  service: string;
  version: string;
}

export interface GithubTestResult {
  success: boolean;
  message?: string;
  error?: string;
}

/* ------------------------------- Repositories ---------------------------- */

export interface Repository {
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  stars: number;
  open_issues: number;
}

export interface RepositoriesResponse {
  success: boolean;
  count?: number;
  repositories?: Repository[];
  error?: string;
}

/* --------------------------------- Overview ------------------------------ */

export interface OverviewCommit {
  sha: string;
  message: string;
  author: string;
}

export interface WorkflowSummary {
  name: string;
  state: string;
}

/**
 * GET /github/repositories/{owner}/{repo}/overview
 * Returns repository info and activity at the top level.
 */
export interface OverviewResponse {
  success: boolean;
  repository?: {
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    default_branch: string;
    language: string | null;
    stars: number;
    fork: boolean;
  };
  branches?: {
    count: number;
    names: string[];
  };
  commits?: {
    count: number;
    recent: OverviewCommit[];
  };
  pull_requests?: {
    open: number;
  };
  issues?: {
    open: number;
  };
  github_actions?: {
    workflow_count: number;
    workflows: WorkflowSummary[];
  };
  error?: string;
}

/* ---------------------------------- Health ------------------------------- */

export interface HealthScore {
  score: number;
  status: string; // excellent | good | needs_improvement | critical
  category_scores: {
    repository: number;
    ci_cd: number;
    development: number;
    issues: number;
    maturity: number;
  };
  signals: string[];
  recommendations: string[];
}

export interface HealthResponse {
  success: boolean;
  repository?: string;
  health?: HealthScore;
  error?: string;
}

/* --------------------------------- Analyze ------------------------------- */

export interface RepositoryAnalysis {
  file_count: number;
  directory_count: number;
  documentation: {
    readme: boolean;
  };
  technologies: string[];
  testing: {
    detected: boolean;
  };
  ci_cd: {
    github_actions: boolean;
  };
  devops: {
    docker: boolean;
    docker_compose: boolean;
  };
  dependencies: {
    python: boolean;
    node: boolean;
  };
  security: {
    suspicious_files: string[];
    potential_secret_files: number;
  };
  files: string[];
}

export interface AnalysisResponse {
  success: boolean;
  repository?: string;
  default_branch?: string;
  analysis?: RepositoryAnalysis;
  error?: string;
}

/* ---------------------------------- Report ------------------------------- */

export interface ReportRecommendation {
  priority: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  category: string;
  message: string;
}

export interface ForgeOpsReport {
  repository: string;
  health: {
    score: number;
    status: string;
    category_scores: HealthScore["category_scores"];
  };
  technology: {
    languages: string[];
    file_count: number;
  };
  engineering: {
    documentation: string; // good | missing
    testing: string; // detected | missing
    ci_cd: string; // configured | missing
    docker: string; // configured | missing
    dependencies: {
      python: boolean;
      node: boolean;
    };
  };
  security: {
    suspicious_files: number;
  };
  recommendations: ReportRecommendation[];
}

export interface ReportResponse {
  success: boolean;
  report?: ForgeOpsReport;
  error?: string;
}

/* ------------------------------ Fix CI / Automation ---------------------- */

export interface CiFixResult {
  branch: string;
  pull_request: {
    number: number;
    title: string;
    url: string;
  };
}

export interface CiFixResponse {
  success: boolean;
  message?: string;
  result?: CiFixResult;
  error?: string;
}