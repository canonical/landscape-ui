import type { Local } from "@canonical/landscape-openapi";

export const repositories: Local[] = [
  {
    name: "locals/aaaa-bbbb-cccc",
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
] as const;

export const repoPackages = ["package 1", "package 2", "package 3"] as const;

export const succeededTask = {
  name: "task/vvvv-tttt-pppp",
  display_name: "validate packages",
  task_id: "vvvv-tttt-pppp",
  status: "succeeded",
  output: "package-A, package-B",
};

export const failedTask = {
  name: "task/vvvv-tttt-pppp",
  display_name: "validate packages",
  task_id: "vvvv-tttt-pppp",
  status: "failed",
  output: "package-A, package-B",
};

export const inProgressTask = {
  name: "task/vvvv-tttt-pppp",
  display_name: "validate packages",
  task_id: "vvvv-tttt-pppp",
  status: "in progress",
  output: "",
};

export const emptyTask = {
  name: "task/vvvv-tttt-pppp",
  display_name: "validate packages",
  task_id: "vvvv-tttt-pppp",
  status: "succeeded",
  output: "",
};
