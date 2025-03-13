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
