import type { PageParams } from "@/libs/pageParamsManager";
import { pageParamsManager, setTabValues } from "@/libs/pageParamsManager";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";

interface UsePageParamsReturnType extends PageParams {
  setPageParams: (newParams: Partial<PageParams>) => void;
  lastSidePathSegment: string | undefined;
  popSidePath: () => void;
  createSidePathPusher: (value: string) => () => void;
  createPageParamsSetter: (newParams: Partial<PageParams>) => () => void;
  popSidePathUntilClear: () => void;
  closeSidePanel: () => void;
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
    ({ tabSlots, ...newParams }: Partial<PageParams>): void => {
      setSearchParams(
        (prevSearchParams) => {
          const current = pageParamsManager.parseTabValues(prevSearchParams);

          // Switching the page-level tab starts the new tab from a clean URL.
          if (newParams.tab && newParams.tab !== current.tab) {
            return new URLSearchParams({ tab: newParams.tab });
          }

          const updatedSearchParams = new URLSearchParams(
            prevSearchParams.toString(),
          );

          if (pageParamsManager.shouldResetPage(newParams)) {
            updatedSearchParams.delete(pageParamsManager.getCurrentPageParam());
          }

          Object.entries(newParams).forEach(([key, value]) => {
            if (key !== "tab") {
              updatedSearchParams.set(key, String(value));
            }
          });

          // The panel slot belongs to the panel being shown, so opening,
          // pushing, popping or closing a side path resets it to its default.
          const nextTabSlots =
            "sidePath" in newParams
              ? { ...current.tabSlots, panel: "" }
              : current.tabSlots;

          setTabValues(
            updatedSearchParams,
            newParams.tab ?? current.tab,
            { ...nextTabSlots, ...tabSlots },
          );

          return pageParamsManager.sanitizeSearchParams(updatedSearchParams);
        },
        { replace: true },
      );
    },
    [setSearchParams],
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

  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    name: "",
  });

  const popSidePathUntilClear =
    parsedSearchParams.sidePath.length > 1 ? popSidePath : closeSidePanel;

  return {
    ...parsedSearchParams,
    setPageParams,
    lastSidePathSegment,
    popSidePath,
    createSidePathPusher,
    createPageParamsSetter,
    popSidePathUntilClear,
    closeSidePanel,
  };
};

export default usePageParams;
