import type { AutoinstallFile } from "@/features/autoinstall-files";

export interface FormProps {
  dropdownChoice: "new" | "assign-existing" | "inherit" | "";
  filename: string;
  contents: string;
  selectedAutoinstallFile: AutoinstallFile | null;
}
