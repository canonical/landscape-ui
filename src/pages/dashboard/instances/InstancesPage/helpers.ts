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
  contractExpiryDays: string;
  os: string;
  query: string;
  status: string;
  tags: string[];
}

export const getQuery = ({
  accessGroups,
  availabilityZones,
  contractExpiryDays,
  os,
  query,
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

  if (contractExpiryDays) {
    queryParts.push(
      getOptionQuery(FILTERS.contractExpiryDays, contractExpiryDays),
    );
  }

  if (query) {
    queryParts.push(...query.split(","));
  }

  if (tags.length) {
    queryParts.push(tags.map((tag) => `tag:${tag}`).join(" OR "));
  }

  if (accessGroups.length) {
    queryParts.push(
      accessGroups
        .map((accessGroup) => `access-group:${accessGroup}`)
        .join(" OR "),
    );
  }

  if (availabilityZones.length) {
    queryParts.push(
      availabilityZones.includes("none")
        ? "availability-zone:null"
        : availabilityZones
            .map((availabilityZone) => `availability-zone:${availabilityZone}`)
            .join(" OR "),
    );
  }

  return queryParts.join(" ");
};
