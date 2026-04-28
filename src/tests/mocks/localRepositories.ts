import type { Local } from "@/features/local-repositories";

export const repositories: Local[] = [
  {
    name: "locals/aaaa-bbbb-cccc",
    localId: "aaaa-bbbb-cccc",
    displayName: "repo 1",
    defaultDistribution: "distribution 1",
    defaultComponent: "component 1",
  },
  {
    name: "locals/bbbb-cccc-dddd",
    localId: "bbbb-cccc-dddd",
    displayName: "repo 2",
    comment: "repo 2 description",
    defaultDistribution: "distribution 2",
    defaultComponent: "component 2",
  },
  {
    name: "locals/cccc-dddd-eeee",
    localId: "cccc-dddd-eeee",
    displayName: "repo 3",
    comment: "repo 3 description",
    defaultDistribution: "distribution 3",
    defaultComponent: "component 3",
  },
] as const;

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
