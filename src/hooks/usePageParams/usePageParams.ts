import type { PageParams } from "@/libs/pageParamsManager";
import { pageParamsManager } from "@/libs/pageParamsManager";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";

interface UsePageParamsReturnType extends PageParams {
  setPageParams: (newParams: Partial<PageParams>) => void;
  lastSidePathSegment: string;
  popSidePath: () => void;
  createSidePathPusher: (value: string) => () => void;
  createPageParamsSetter: (newParams: Partial<PageParams>) => () => void;
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

  const setPageParams = useCallback(
    (newParams: Partial<PageParams>): void => {
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
    },
    [parsedSearchParams.tab, setSearchParams],
  );

  const lastSidePathSegment =
    parsedSearchParams.sidePath[parsedSearchParams.sidePath.length - 1];

  const createPageParamsSetter = useCallback(
    (newParams: Partial<PageParams>) => {
      return () => {
        setPageParams(newParams);
      };
    },
    [setPageParams],
  );

  const popSidePath = createPageParamsSetter({
    sidePath: parsedSearchParams.sidePath.slice(0, -1),
  });

  const createSidePathPusher = (value: string) => {
    return createPageParamsSetter({
      sidePath: [...parsedSearchParams.sidePath, value],
    });
  };

  return {
    ...parsedSearchParams,
    setPageParams,
    lastSidePathSegment,
    popSidePath,
    createSidePathPusher,
    createPageParamsSetter,
  };
};

export default usePageParams;
