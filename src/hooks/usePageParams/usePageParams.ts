import { useEffect } from "react";
import { useSearchParams } from "react-router";
import type {
  PageParams,
  UsePageParamsReturnType,
} from "@/libs/pageParamsManager";
import { pageParamsManager } from "@/libs/pageParamsManager";

export interface UsePageParamsReturnType extends Required<PageParams> {
  setPageParams: (newParams: PageParams) => void;
}

const usePageParams = (): UsePageParamsReturnType => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const sanitizedParams =
      pageParamsManager.sanitizeSearchParams(searchParams);
    if (sanitizedParams.toString() !== searchParams.toString()) {
      setSearchParams(sanitizedParams, { replace: true });
    }
  }, [searchParams, setSearchParams, pageParamsManager]);

  const parsedSearchParams = pageParamsManager.getParsedParams(searchParams);

  const setPageParams = (newParams: PageParams): void => {
    setSearchParams(
      (prevSearchParams) => {
        const switchedTabs =
          newParams.tab && newParams.tab !== parsedSearchParams.tab;

        if (switchedTabs) {
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

  return {
    ...parsedSearchParams,
    setPageParams,
  };
};

export default usePageParams;
