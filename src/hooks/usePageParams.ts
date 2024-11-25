import { useSearchParams } from "react-router-dom";

const ALLOWED_PAGE_SIZES = [20, 50, 100];

const ALLOWED_DAY_OPTIONS = [1, 7, 30, 90, 180, 365];

export const PARAMS = {
  ACCESS_GROUPS: "accessGroups",
  AVAILABILITY_ZONES: "availabilityZones",
  CURRENT_PAGE: "currentPage",
  DAYS: "days",
  DISABLED_COLUMNS: "disabledColumns",
  FROM_DATE: "fromDate",
  GROUP_BY: "groupBy",
  OS: "os",
  PAGE_SIZE: "pageSize",
  SEARCH: "search",
  STATUS: "status",
  TAB: "tab",
  TAGS: "tags",
  TO_DATE: "toDate",
  TYPE: "type",
};

const modifyUrlParameters = (
  params: URLSearchParams,
  key: string,
  value: string | string[] | number | number[],
) => {
  if (value === "" || (Array.isArray(value) && value.length === 0)) {
    params.delete(key);
  } else {
    params.set(key, String(value));
  }
};

export const usePageParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    ACCESS_GROUPS,
    AVAILABILITY_ZONES,
    CURRENT_PAGE,
    DAYS,
    DISABLED_COLUMNS,
    FROM_DATE,
    GROUP_BY,
    OS,
    PAGE_SIZE,
    SEARCH,
    STATUS,
    TAB,
    TAGS,
    TO_DATE,
    TYPE,
  } = PARAMS;

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
    : ALLOWED_PAGE_SIZES[0];
  const tags = searchParams.get(TAGS)?.split(",").filter(Boolean) ?? [];
  const availabilityZones =
    searchParams.get(AVAILABILITY_ZONES)?.split(",").filter(Boolean) ?? [];
  const accessGroups =
    searchParams.get(ACCESS_GROUPS)?.split(",").filter(Boolean) ?? [];
  const disabledColumns =
    searchParams.get(DISABLED_COLUMNS)?.split(",").filter(Boolean) ?? [];
  const type = searchParams.get(TYPE) ?? "";
  const fromDate = searchParams.get(FROM_DATE) ?? "";
  const toDate = searchParams.get(TO_DATE) ?? "";

  const setPageParams = (newParams: {
    accessGroups?: string[];
    availabilityZones?: string[];
    currentPage?: number;
    days?: string;
    disabledColumns?: string[];
    fromDate?: string;
    groupBy?: string;
    os?: string;
    pageSize?: number;
    search?: string;
    status?: string;
    tab?: string;
    tags?: string[];
    toDate?: string;
    type?: string;
  }) => {
    setSearchParams(
      (prevSearchParams) => {
        const updatedSearchParams = new URLSearchParams(
          prevSearchParams.toString(),
        );

        //reset params if tab has changed
        if (newParams.tab && newParams.tab !== tab) {
          return new URLSearchParams({
            tab: newParams.tab,
          });
        }

        //reset current page
        if (
          newParams.search ||
          newParams.pageSize ||
          newParams.status ||
          newParams.os ||
          newParams.groupBy ||
          newParams.days ||
          newParams.tags ||
          newParams.availabilityZones ||
          newParams.accessGroups ||
          newParams.type ||
          newParams.fromDate ||
          newParams.toDate
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
    accessGroups,
    availabilityZones,
    currentPage,
    days,
    disabledColumns,
    fromDate,
    groupBy,
    os,
    pageSize,
    search,
    setPageParams,
    status,
    tab,
    tags,
    toDate,
    type,
  };
};
