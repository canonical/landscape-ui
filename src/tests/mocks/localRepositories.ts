import type { Local } from "@canonical/landscape-openapi";

export const repositories = [
  {
    name: "locals/aaaa-bbbb-cccc",
    localId: "aaaa-bbbb-cccc",
    defaultComponent: "component 1",
    displayName: "repo 1",
    comment: "repo 1 description",
    defaultDistribution: "distribution 1",
  },
  {
    name: "locals/bbbb-cccc-dddd",
    localId: "bbbb-cccc-dddd",
    displayName: "repo 2",
    comment: "repo 2 description",
    defaultComponent: "component 2",
    defaultDistribution: "distribution 2",
  },
  {
    name: "locals/cccc-dddd-eeee",
    localId: "cccc-dddd-eeee",
    displayName: "repo 3",
    comment: "repo 3 description",
    defaultDistribution: "distribution 3",
    defaultComponent: "component 3",
  },
] as const satisfies Local[];

export const repoPackages = ["package 1", "package 2", "package 3"] as const;

export const succeededTask = {
  name: "task/vvvv-tttt-pppp",
  done: true,
  response: ["package-A", "package-B"],
  metadata: {
    description: "validate packages",
    operation_id: "vvvv-tttt-pppp",
    status: "succeeded",
  },
};

export const failedTask = {
  name: "task/vvvv-tttt-pppp",
  done: true,
  response: ["package-A"],
  error: {
    code: 408,
    message: "Request timed out",
  },
  metadata: {
    description: "validate packages",
    operation_id: "vvvv-tttt-pppp",
    status: "failed",
  },
};

export const inProgressTask = {
  name: "task/vvvv-tttt-pppp",
  done: true,
  response: [],
  metadata: {
    description: "validate packages",
    operation_id: "vvvv-tttt-pppp",
    status: "in progress",
  },
};

export const emptyTask = {
  name: "task/vvvv-tttt-pppp",
  done: true,
  response: [],
  metadata: {
    description: "validate packages",
    operation_id: "vvvv-tttt-pppp",
    status: "succeeded",
  },
};
