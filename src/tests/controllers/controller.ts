import { hasOneItem } from "@/utils/_helpers";
import type { JsonBodyType } from "msw";

type EndpointStatusType = "empty" | "error" | "default" | "loading" | "variant";

interface EndpointStatus {
  status: EndpointStatusType;
  path?: string;
  response?: JsonBodyType;
}

type EndpointStatusWithPath = EndpointStatus & { path: string };

const DEFAULT_ENDPOINT_STATUS: EndpointStatus = {
  status: "default",
  path: "",
};

let endpointStatuses: EndpointStatus[] = [DEFAULT_ENDPOINT_STATUS];

export const normalizeEndpointPath = (value?: string) =>
  value?.replace(/^\/+|\/+$/g, "") ?? "";

const normalizeEndpointStatuses = (
  value: EndpointStatus | EndpointStatus[] | EndpointStatusType,
): EndpointStatus[] => {
  if (typeof value === "string") {
    return [{ status: value }];
  }

  return Array.isArray(value) ? value : [value];
};

export const getEndpointStatus = (path?: string): EndpointStatus => {
  if (path) {
    const normalized = normalizeEndpointPath(path);
    const targetedStatus = endpointStatuses.find(
      (status) => normalizeEndpointPath(status.path) === normalized,
    );

    if (targetedStatus) {
      return targetedStatus;
    }
  }

  const globalStatus = endpointStatuses.find(
    (status) => !normalizeEndpointPath(status.path),
  );

  if (globalStatus) {
    return globalStatus;
  }

  if (!path && hasOneItem(endpointStatuses)) {
    return endpointStatuses[0];
  }

  return DEFAULT_ENDPOINT_STATUS;
};

type SetEndpointStatusValue =
  | EndpointStatus
  | EndpointStatusWithPath[]
  | EndpointStatusType;

export function setEndpointStatus(value: SetEndpointStatusValue): void {
  endpointStatuses = normalizeEndpointStatuses(value);
}
