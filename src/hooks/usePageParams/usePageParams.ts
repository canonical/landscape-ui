import type { PageParams } from "@/libs/pageParamsManager";
import { pageParamsManager } from "@/libs/pageParamsManager";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

interface UsePageParamsReturnType extends PageParams {
  setPageParams: (newParams: Partial<PageParams>) => void;
  peekSidePath: () => string;
  pushSidePath: (value: string) => void;
  popSidePath: () => void;
}

const usePageParams = (): UsePageParamsReturnType => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const sanitizedParams =
      pageParamsManager.sanitizeSearchParams(searchParams);
    if (sanitizedParams.toString() !== searchParams.toString()) {
      setSearchParams(sanitizedParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const parsedSearchParams = pageParamsManager.getParsedParams(searchParams);

  const setPageParams = (newParams: Partial<PageParams>): void => {
    setSearchParams(
      (prevSearchParams) => {
        if (newParams.tab && newParams.tab !== parsedSearchParams.tab) {
          return new URLSearchParams({ tab: newParams.tab });
        }

        const updatedSearchParams = new URLSearchParams(
          prevSearchParams.toString(),
        );

        if (pageParamsManager.shouldResetPage(newParams)) {
          updatedSearchParams.delete(pageParamsManager.getCurrentPageParam());
        }

        Object.entries(newParams).forEach(([key, value]) => {
          updatedSearchParams.set(key, String(value));
        });

        return pageParamsManager.sanitizeSearchParams(updatedSearchParams);
      },
      { replace: true },
    );
  };

  const peekSidePath = () =>
    parsedSearchParams.sidePath[parsedSearchParams.sidePath.length - 1];

  const pushSidePath = (value: string) => {
    setPageParams({ sidePath: [...parsedSearchParams.sidePath, value] });
  };

  const popSidePath = () => {
    setPageParams({ sidePath: parsedSearchParams.sidePath.slice(0, -1) });
  };

  return {
    ...parsedSearchParams,
    setPageParams,
    peekSidePath,
    pushSidePath,
    popSidePath,
  };
};

export default usePageParams;
