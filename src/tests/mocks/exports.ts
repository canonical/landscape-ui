import type { ExportJob } from "@/features/exports";

export const processingExportJob: ExportJob = {
  id: "job-processing",
  name: "Instances export 2026-06-03 14:10:00",
  filename: "instances-export-1.tsv",
  row_count: 120,
  type: "instance",
  created_at: "2026-06-03T12:10:00.000Z",
  status: "processing",
  progress: 35,
  download_ready: false,
  retain_until: "2029-06-03T12:10:00.000Z",
  query: "tag:production",
};

export const completedExportJob: ExportJob = {
  id: "job-completed",
  name: "Instances export 2026-06-03 14:08:00",
  filename: "instances-export-2.tsv",
  row_count: 42,
  type: "instance",
  created_at: "2026-06-03T12:08:00.000Z",
  status: "completed",
  progress: 100,
  download_ready: true,
  retain_until: "2029-06-03T12:08:00.000Z",
  query: "id:1 OR id:2",
};

export const failedExportJob: ExportJob = {
  id: "job-failed",
  name: "Instances export 2026-06-03 14:06:00",
  filename: "instances-export-3.tsv",
  row_count: 12,
  type: "instance",
  created_at: "2026-06-03T12:06:00.000Z",
  status: "failed",
  progress: 100,
  download_ready: false,
  retain_until: "2029-06-03T12:06:00.000Z",
  query: null,
};

export const processingActivitiesExportJob: ExportJob = {
  id: "act-job-processing",
  name: "Activities export 2026-06-03 14:10:00",
  filename: "activities-export-1.tsv",
  row_count: 50,
  type: "activity",
  created_at: "2026-06-03T12:10:00.000Z",
  status: "processing",
  progress: 30,
  download_ready: false,
  retain_until: "2029-06-03T12:10:00.000Z",
  query: "status:succeeded",
};

export const completedActivitiesExportJob: ExportJob = {
  id: "act-job-completed",
  name: "Activities export 2026-06-03 14:08:00",
  filename: "activities-export-2.tsv",
  row_count: 20,
  type: "activity",
  created_at: "2026-06-03T12:08:00.000Z",
  status: "completed",
  progress: 100,
  download_ready: true,
  retain_until: "2029-06-03T12:08:00.000Z",
  query: null,
};

export const failedActivitiesExportJob: ExportJob = {
  id: "act-job-failed",
  name: "Activities export 2026-06-03 14:06:00",
  filename: "activities-export-3.tsv",
  row_count: 0,
  type: "activity",
  created_at: "2026-06-03T12:06:00.000Z",
  status: "failed",
  progress: 100,
  download_ready: false,
  retain_until: "2029-06-03T12:06:00.000Z",
  query: null,
};
