import type { ExportJob } from "@/features/exports";

export const processingExportJob: ExportJob = {
  id: 1,
  name: "Instances export 2026-06-03 14:10:00",
  filename: "instances-export-1.tsv",
  row_count: 120,
  type: "instance",
  created_at: "2026-06-03T12:10:00.000Z",
  status: "processing",
  progress: 35,
  estimated_seconds_remaining: 150,
  download_ready: false,
  retain_until: "2029-06-03T12:10:00.000Z",
  query: "tag:production",
};

export const completedExportJob: ExportJob = {
  id: 2,
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
  id: 3,
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

export const newExportJob: ExportJob = {
  id: 4,
  name: "Instances export 2026-06-03 14:12:00",
  filename: "instances-export-4.tsv",
  row_count: 0,
  type: "instance",
  created_at: "2026-06-03T12:12:00.000Z",
  status: "processing",
  progress: 0,
  estimated_seconds_remaining: null,
  download_ready: false,
  retain_until: "2029-06-03T12:12:00.000Z",
  query: "tag:production",
};

export const processingActivitiesExportJob: ExportJob = {
  id: 5,
  name: "Activities export 2026-06-03 14:10:00",
  filename: "activities-export-1.tsv",
  row_count: 50,
  type: "activity",
  created_at: "2026-06-03T12:10:00.000Z",
  status: "processing",
  progress: 30,
  estimated_seconds_remaining: 19800,
  download_ready: false,
  retain_until: "2029-06-03T12:10:00.000Z",
  query: "status:succeeded",
};

export const completedActivitiesExportJob: ExportJob = {
  id: 6,
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
  id: 7,
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

// Processing jobs covering every ETA label state in the progress bar:
// id 4 → "Estimating..." (null), id 5 → hours + minutes, id 1 → minutes + seconds,
// plus the four below for hours, minutes, seconds and "Almost done".
export const processingHoursExportJob: ExportJob = {
  id: 8,
  name: "Instances export 2026-06-03 14:14:00",
  filename: "instances-export-8.tsv",
  row_count: 300,
  type: "instance",
  created_at: "2026-06-03T12:14:00.000Z",
  status: "processing",
  progress: 45,
  estimated_seconds_remaining: 7200,
  download_ready: false,
  retain_until: "2029-06-03T12:14:00.000Z",
  query: "tag:production",
};

export const processingMinutesExportJob: ExportJob = {
  id: 9,
  name: "Instances export 2026-06-03 14:16:00",
  filename: "instances-export-9.tsv",
  row_count: 200,
  type: "instance",
  created_at: "2026-06-03T12:16:00.000Z",
  status: "processing",
  progress: 60,
  estimated_seconds_remaining: 120,
  download_ready: false,
  retain_until: "2029-06-03T12:16:00.000Z",
  query: "tag:production",
};

export const processingSecondsExportJob: ExportJob = {
  id: 10,
  name: "Instances export 2026-06-03 14:18:00",
  filename: "instances-export-10.tsv",
  row_count: 80,
  type: "instance",
  created_at: "2026-06-03T12:18:00.000Z",
  status: "processing",
  progress: 88,
  estimated_seconds_remaining: 30,
  download_ready: false,
  retain_until: "2029-06-03T12:18:00.000Z",
  query: "tag:production",
};

export const processingAlmostDoneExportJob: ExportJob = {
  id: 11,
  name: "Instances export 2026-06-03 14:20:00",
  filename: "instances-export-11.tsv",
  row_count: 60,
  type: "instance",
  created_at: "2026-06-03T12:20:00.000Z",
  status: "processing",
  progress: 99,
  estimated_seconds_remaining: 3,
  download_ready: false,
  retain_until: "2029-06-03T12:20:00.000Z",
  query: "tag:production",
};

export const newComplianceExportJob: ExportJob = {
  id: 12,
  name: "Compliance export 2026-06-24 10:00:00",
  filename: "compliance-export-1.tsv",
  row_count: 0,
  type: "report",
  created_at: "2026-06-24T10:00:00.000Z",
  status: "processing",
  progress: 0,
  download_ready: false,
  retain_until: "2029-06-24T10:00:00.000Z",
  query: "id:42 OR id:107",
  description: "All instances | 60+ days outstanding",
};

// Default fixtures served by the MSW exports handlers so the Exports UI is fully
// browsable in dev mode (`VITE_MSW_ENABLED`) and resolvable by id in tests.
export const DEFAULT_EXPORT_JOBS: ExportJob[] = [
  processingExportJob,
  completedExportJob,
  failedExportJob,
  newExportJob,
  processingActivitiesExportJob,
  completedActivitiesExportJob,
  failedActivitiesExportJob,
  processingHoursExportJob,
  processingMinutesExportJob,
  processingSecondsExportJob,
  processingAlmostDoneExportJob,
  newComplianceExportJob,
];
