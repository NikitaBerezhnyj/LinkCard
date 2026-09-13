import { searchUsers } from "@/services/userServices";
import { IUserSearchResult } from "@/types/user";
import { useCallback, useRef, useState } from "react";

interface UseUserSearchResult {
  results: IUserSearchResult[];
  isLoading: boolean;
  error: Error | null;
  search: (query: string) => Promise<IUserSearchResult[]>;
  clear: () => void;
}

export function useUserSearch(): UseUserSearchResult {
  const [results, setResults] = useState<IUserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestIdRef = useRef(0);

  const search = useCallback(async (query: string): Promise<IUserSearchResult[]> => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchUsers(query);

      if (requestId !== requestIdRef.current) {
        return [];
      }

      setResults(data);

      return data;
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return [];
      }

      const searchError = error instanceof Error ? error : new Error("Не вдалося виконати пошук");

      setResults([]);
      setError(searchError);

      return [];
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const clear = useCallback(() => {
    ++requestIdRef.current;

    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clear
  };
}
