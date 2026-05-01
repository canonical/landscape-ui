export const idleOperation = {
  name: "operations/iiii-dddd-llll",
  done: false,
  response: { type: "OperationCreatedResponse" },
  metadata: {
    description: "validate packages",
    operation_id: "iiii-dddd-llll",
    status: "idle",
  },
};

export const succeededOperation = {
  name: "operations/ssss-cccc-dddd",
  done: true,
  response: ["package-A", "package-B"],
  metadata: {
    description: "validate packages",
    operation_id: "ssss-cccc-ddddd",
    status: "succeeded",
  },
};

export const failedOperation = {
  name: "operations/ffff-llll-dddd",
  done: true,
  response: ["package-A"],
  error: {
    code: 408,
    message: "Request timed out",
  },
  metadata: {
    description: "validate packages",
    operation_id: "ffff-llll-dddd",
    status: "failed",
  },
};

export const inProgressOperation = {
  name: "operations/pppp-gggg-ssss",
  done: false,
  response: [],
  metadata: {
    description: "validate packages",
    operation_id: "pppp-gggg-ssss",
    status: "in progress",
  },
};

export const emptyOperation = {
  name: "operations/mmmm-pppp-tttt",
  done: true,
  response: [],
  metadata: {
    description: "validate packages",
    operation_id: "mmmm-pppp-tttt",
    status: "succeeded",
  },
};
