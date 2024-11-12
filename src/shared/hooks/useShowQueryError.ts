import { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function useShowQueryError(
  queries: UseQueryResult<unknown, Error>[],
) {
  const [hasError, showError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const prevErrorStatesRef = useRef<boolean[]>([]);

  useEffect(() => {
    const isErrors = queries.map((q) => q.isError);

    if (!hasError) {
      let hasNewError = false;
      let errorMessage: string | null = null;

      queries.forEach((query, index) => {
        if (hasNewError) return;

        if (query.isError && !prevErrorStatesRef.current.at(index)) {
          hasNewError = true;
          errorMessage = query.error.message;
        }
      });

      if (hasNewError) {
        showError(true);
        setErrorMessage(errorMessage);
      }
    }

    prevErrorStatesRef.current = isErrors;
  }, [queries, hasError]);

  const dismissError = () => {
    showError(false);
  };

  return { hasError, dismissError, errorMessage };
}
