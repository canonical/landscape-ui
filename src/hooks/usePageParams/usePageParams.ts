import { useSearchParams } from "react-router-dom";
import { PARAMS } from "./constants";
import {
  getParsedParams,
  modifyUrlParameters,
  shouldResetPage,
} from "./helpers";
import { PageParams } from "./types";

const usePageParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { tab, ...rest } = getParsedParams(searchParams);

  const setPageParams = (newParams: PageParams) => {
    setSearchParams(
      (prevSearchParams) => {
        if (newParams.tab && newParams.tab !== tab) {
          return new URLSearchParams({
            tab: newParams.tab,
          });
        }

        const updatedSearchParams = new URLSearchParams(
          prevSearchParams.toString(),
        );

        if (shouldResetPage(newParams)) {
          updatedSearchParams.delete(PARAMS.CURRENT_PAGE);
        }

        Object.entries(newParams).forEach(([key, value]) => {
          modifyUrlParameters(updatedSearchParams, key, value);
        });

        return updatedSearchParams;
      },
      {
        replace: true,
      },
    );
  };

  return {
    tab,
    ...rest,
    setPageParams,
  };
};

export default usePageParams;
