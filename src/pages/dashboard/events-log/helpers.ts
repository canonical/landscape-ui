import { EventLog } from "@/types/EventLogs";

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

  // Create URL for blob
  const url = URL.createObjectURL(blob);

  // Create link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append link to body
  document.body.appendChild(link);

  // Programmatically click the link to start download
  link.click();

  // Clean up by removing the link
  document.body.removeChild(link);
};
