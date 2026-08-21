import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CurrentRepo {
  owner: string;
  name: string;
  fullName: string;
}

interface RepoContextValue {
  repo: CurrentRepo | null;
  setRepo: (repo: CurrentRepo | null) => void;
}

const STORAGE_KEY = "forgeops:current-repo";

const RepoContext = createContext<RepoContextValue>({
  repo: null,
  setRepo: () => undefined,
});

function readStoredRepo(): CurrentRepo | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CurrentRepo;
    if (parsed && parsed.owner && parsed.name) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function RepoProvider({ children }: { children: ReactNode }) {
  const [repo, setRepoState] = useState<CurrentRepo | null>(readStoredRepo);

  const setRepo = useCallback((next: CurrentRepo | null) => {
    setRepoState(next);
    try {
      if (next) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage unavailable (private mode) — in-memory state still works.
    }
  }, []);

  const value = useMemo(() => ({ repo, setRepo }), [repo, setRepo]);

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}

export function useRepo(): RepoContextValue {
  return useContext(RepoContext);
}