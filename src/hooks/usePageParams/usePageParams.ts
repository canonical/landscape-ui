import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { PARAMS } from "./constants";
import {
  getParsedParams,
  sanitizeSearchParams,
  shouldResetPage,
} from "./helpers";
import type { PageParams } from "./types";

const usePageParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const sanitizedParams = sanitizeSearchParams(searchParams);
    if (sanitizedParams.toString() !== searchParams.toString()) {
      setSearchParams(sanitizedParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const parsedSearchParams = getParsedParams(searchParams);

  const setPageParams = (newParams: PageParams) => {
    setSearchParams(
      (prevSearchParams) => {
        const switchedTabs =
          newParams.tab && newParams.tab !== parsedSearchParams.tab;

        if (switchedTabs) {
          return new URLSearchParams({
            tab: newParams.tab,
          });
        }

        const updatedSearchParams = new URLSearchParams(
          prevSearchParams.toString(),
        );

        if (shouldResetPage(newParams)) {
          updatedSearchParams.delete(PARAMS.CURRENT_PAGE.urlParam);
        }

        Object.entries(newParams).forEach(([key, value]) => {
          updatedSearchParams.set(key, String(value));
        });

        return sanitizeSearchParams(updatedSearchParams);
      },
      {
        replace: true,
      },
    );
  };

  return {
    ...parsedSearchParams,
    setPageParams,
  };
};

export default usePageParams;
