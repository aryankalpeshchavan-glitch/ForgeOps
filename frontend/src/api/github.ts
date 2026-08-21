import { get, post } from "./client";
import type {
  AnalysisResponse,
  CiFixResponse,
  GithubTestResult,
  HealthInfo,
  HealthResponse,
  OverviewResponse,
  RepositoriesResponse,
  ReportResponse,
  ServiceInfo,
} from "./types";

/**
 * ForgeOps backend endpoints.
 * Paths match the FastAPI routes exactly.
 */

export const api = {
  serviceInfo: (signal?: AbortSignal) => get<ServiceInfo>("/", signal),

  health: (signal?: AbortSignal) => get<HealthInfo>("/health", signal),

  githubTest: (signal?: AbortSignal) =>
    get<GithubTestResult>("/github/test", signal),

  repositories: (signal?: AbortSignal) =>
    get<RepositoriesResponse>("/github/repositories", signal),

  overview: (owner: string, repo: string, signal?: AbortSignal) =>
    get<OverviewResponse>(
      `/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/overview`,
      signal,
    ),

  healthScore: (owner: string, repo: string, signal?: AbortSignal) =>
    get<HealthResponse>(
      `/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/health`,
      signal,
    ),

  analysis: (owner: string, repo: string, signal?: AbortSignal) =>
    get<AnalysisResponse>(
      `/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/analyze`,
      signal,
    ),

  report: (owner: string, repo: string, signal?: AbortSignal) =>
    get<ReportResponse>(
      `/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/report`,
      signal,
    ),

  fixCi: (owner: string, repo: string, signal?: AbortSignal) =>
    post<CiFixResponse>(
      `/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/fix/ci`,
      undefined,
      signal,
    ),
};