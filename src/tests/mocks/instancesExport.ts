import type { InstancesExportJob } from "../../features/instances/types/InstancesExportJob";

export const processingExportJob: InstancesExportJob = {
  id: "job-processing",
  name: "Instances export 2026-06-03 14:10:00",
  filename: "instances-export-1.tsv",
  instanceCount: 120,
  attributeLabels: ["Instance name", "Hostname", "Status"],
  selectedFieldIds: ["title", "hostname", "status"],
  createdAt: "2026-06-03T12:10:00.000Z",
  status: "processing",
  progress: 35,
  downloadReady: false,
};

export const completedExportJob: InstancesExportJob = {
  id: "job-completed",
  name: "Instances export 2026-06-03 14:08:00",
  filename: "instances-export-2.tsv",
  instanceCount: 42,
  attributeLabels: ["Instance name", "Access group"],
  selectedFieldIds: ["title", "access_group"],
  createdAt: "2026-06-03T12:08:00.000Z",
  status: "completed",
  progress: 100,
  downloadReady: true,
};

export const failedExportJob: InstancesExportJob = {
  id: "job-failed",
  name: "Instances export 2026-06-03 14:06:00",
  filename: "instances-export-3.tsv",
  instanceCount: 12,
  attributeLabels: ["Hostname"],
  selectedFieldIds: ["hostname"],
  createdAt: "2026-06-03T12:06:00.000Z",
  status: "failed",
  progress: 100,
  errorMessage: "",
  downloadReady: false,
};
