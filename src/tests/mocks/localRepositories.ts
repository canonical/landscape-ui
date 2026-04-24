import type { Local } from "@/features/local-repositories";

export const repositories: Local[] = [
  {
    name: "locals/aaaa-bbbb-cccc",
    local_id: "aaaa-bbbb-cccc",
    display_name: "repo 1",
    distribution: "distribution 1",
    component: "component 1",
  },
  {
    name: "locals/bbbb-cccc-dddd",
    local_id: "bbbb-cccc-dddd",
    display_name: "repo 2",
    comment: "repo 2 description",
    distribution: "distribution 2",
    component: "component 2",
  },
  {
    name: "locals/cccc-dddd-eeee",
    local_id: "cccc-dddd-eeee",
    display_name: "repo 3",
    comment: "repo 3 description",
    distribution: "distribution 3",
    component: "component 3",
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
