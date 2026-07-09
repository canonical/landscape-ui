import type { EventLog } from "@/features/events-log";
import { downloadBlob } from "@/utils/browserDownload";

export const downloadCSV = (eventsLog: EventLog[], filename: string) => {
  const header = [
    "creation_time",
    "person_id",
    "person_name",
    "entity_type",
    "entity_id",
    "entity_name",
    "message",
  ];

  const csvHeader = [
    "Creation Time",
    "Person ID",
    "Person Name",
    "Entity Type",
    "Entity ID",
    "Entity Name",
    "Message",
  ];

  const csv = [
    csvHeader.join(","),
    ...eventsLog.map((row) =>
      header.map((fieldName) => row[fieldName]).join(","),
    ),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
};
