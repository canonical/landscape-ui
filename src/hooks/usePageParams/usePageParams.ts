import type { PageParams } from "@/libs/pageParamsManager";
import { pageParamsManager } from "@/libs/pageParamsManager";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

interface UsePageParamsReturnType extends PageParams {
  setPageParams: (newParams: Partial<PageParams>) => void;
  status: string;
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

  const { statuses, passRateFrom, passRateTo, ...parsedSearchParams } =
    pageParamsManager.getParsedParams(searchParams);

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

  return {
    ...parsedSearchParams,
    setPageParams,
    status: statuses[0],
    statuses,
    passRateFrom,
    passRateTo,
  };
};

export default usePageParams;
