import type { InstanceChild } from "@/types/Instance";

export const getCompliance = (wslInstance: InstanceChild) => {
  switch (wslInstance.compliance) {
    case "compliant":
      return "Compliant";
    case "noncompliant":
      return "Not compliant";
    case "uninstalled":
      return "Not installed";
    case "unregistered":
      return "Not created by Landscape";
  }
};
