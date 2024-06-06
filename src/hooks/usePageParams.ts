import { useSearchParams } from "react-router-dom";

const ALLOWED_PAGE_SIZES = [20, 50, 100];

const ALLOWED_DAY_OPTIONS = [1, 7, 30, 90, 180, 365];

const PARAMS = {
  SEARCH: "search",
  CURRENT_PAGE: "currentPage",
  PAGE_SIZE: "pageSize",
  TAB: "tab",
  STATUS: "status",
  OS: "os",
  GROUP_BY: "groupBy",
  DAYS: "days",
};

const modifyUrlParameters = (
  params: URLSearchParams,
  key: string,
  value: string | number,
) => {
  if (value === "") {
    params.delete(key);
  } else {
    params.set(key, String(value));
  }
};

export const usePageParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { CURRENT_PAGE, PAGE_SIZE, SEARCH, TAB, STATUS, DAYS, GROUP_BY, OS } =
    PARAMS;

  const tab = searchParams.get(TAB) ?? "";
  const status = searchParams.get(STATUS) ?? "";
  const os = searchParams.get(OS) ?? "";
  const groupBy = searchParams.get(GROUP_BY) ?? "";
  const days = ALLOWED_DAY_OPTIONS.includes(Number(searchParams.get(DAYS)))
    ? Number(searchParams.get(DAYS))
    : 7;
  const search = searchParams.get(SEARCH) ?? "";
  const currentPage = Number(searchParams.get(CURRENT_PAGE) ?? "1");
  const pageSize = ALLOWED_PAGE_SIZES.includes(
    Number(searchParams.get(PAGE_SIZE)),
  )
    ? Number(searchParams.get(PAGE_SIZE))
    : 20;

  const setPageParams = (newParams: {
    search?: string;
    currentPage?: number;
    pageSize?: number;
    tab?: string;
    status?: string;
    os?: string;
    groupBy?: string;
    days?: string;
  }) => {
    setSearchParams(
      (prevSearchParams) => {
        const updatedSearchParams = new URLSearchParams(
          prevSearchParams.toString(),
        );

        const hasFilters = Boolean(
          newParams.status ||
            newParams.os ||
            newParams.groupBy ||
            newParams.days,
        );

        //reset params if tab has changed
        if (newParams.tab && newParams.tab !== tab) {
          return new URLSearchParams({
            tab: newParams.tab,
          });
        }

        //reset current page
        if (
          newParams.search !== "" ||
          newParams.pageSize !== undefined ||
          hasFilters
        ) {
          updatedSearchParams.delete(CURRENT_PAGE);
        }

        //update params
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
    search,
    currentPage,
    pageSize,
    setPageParams,
    status,
    os,
    groupBy,
    days,
  };
};
