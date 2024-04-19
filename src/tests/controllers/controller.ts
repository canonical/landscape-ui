type EndpointStatus = "empty" | "error" | "default";

let endpointStatus: EndpointStatus = "default";

export const getEndpointStatus = () => endpointStatus;
export const setEndpointStatus = (value: EndpointStatus) => {
  endpointStatus = value;
};
