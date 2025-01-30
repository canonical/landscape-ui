import { FILTERS } from "@/features/instances";
import type { ListFilter } from "@/types/Filters";

export const getOptionQuery = (filter: ListFilter, optionValue: string) => {
  return filter.type === "select"
    ? (filter.options.find((option) => option.value === optionValue)?.query ??
        "")
    : "";
};

interface GetQueryProps {
  accessGroups: string[];
  availabilityZones: string[];
  os: string;
  search: string;
  status: string;
  tags: string[];
}

export const getQuery = ({
  accessGroups,
  availabilityZones,
  os,
  search,
  status,
  tags,
}: GetQueryProps) => {
  const queryParts: string[] = [];

  if (os) {
    queryParts.push(getOptionQuery(FILTERS.os, os));
  }

  if (status) {
    queryParts.push(getOptionQuery(FILTERS.status, status));
  }

  if (search) {
    queryParts.push(...search.split(","));
  }

  if (tags.length) {
    queryParts.push(`tag:${tags.join(" OR tag:")}`);
  }

  if (accessGroups.length) {
    queryParts.push(`access-group:${accessGroups.join(" OR access-group:")}`);
  }

  if (availabilityZones.length) {
    queryParts.push(
      availabilityZones.includes("none")
        ? "availability-zone:null"
        : `availability-zone:${availabilityZones.join(" OR availability-zone:")}`,
    );
  }

  return queryParts.join(" ");
};
