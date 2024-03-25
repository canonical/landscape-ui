import { CommonPackageProps } from "@/types/Package";

export interface CommonPackage extends CommonPackageProps {
  available_version: string | null;
  current_version: string | null;
  status: "available" | "installed" | "held";
}
