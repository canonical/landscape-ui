type EndpointStatusType = "empty" | "error" | "default";

interface EndpointStatus {
  status: EndpointStatusType;
  path?: string;
}

let endpointStatus: EndpointStatus = {
  status: "default",
  path: "",
};

export const getEndpointStatus = (): EndpointStatus => endpointStatus;
export const setEndpointStatus = (
  value: EndpointStatus | EndpointStatusType,
): void => {
  if (typeof value === "string") {
    endpointStatus = {
      status: value,
    };
  } else {
    endpointStatus = value;
  }
};

let manySavedSearches = false;

export const getManySavedSearches = (): boolean => manySavedSearches;
export const setManySavedSearches = (value: boolean): void => {
  manySavedSearches = value;
};
