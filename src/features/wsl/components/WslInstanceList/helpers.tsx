import type { InstanceChild } from "@/types/Instance";

export const getCompliance = (wslInstance: InstanceChild) => {
  switch (wslInstance.compliance) {
    case "compliant":
      return "Compliant";
    case "pending":
      return "Pending";
    case "noncompliant":
      return "Not compliant";
    case "uninstalled":
      return "Not installed";
    case "unregistered":
      return "Not created by Landscape";
  }
};

export const getComplianceIcon = (wslInstance: InstanceChild) => {
  switch (wslInstance.compliance) {
    case "compliant":
      return "success-grey";
    case "pending":
      return "status-queued";
    default:
      return "warning";
  }
};
