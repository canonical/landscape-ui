import type { GroupedOption } from "@/components/filter";
import { AUTOINSTALL_FILE_LANGUAGES } from "./constants";
import type { AutoinstallFile } from "./types";

export const removeAutoinstallFileExtension = (filename: string): string => {
  return filename.replace(
    new RegExp(`\\.(${AUTOINSTALL_FILE_LANGUAGES.join("|")})$`),
    "",
  );
};

export const getAutoinstallFileOptions = (
  autoinstallFiles: AutoinstallFile[],
): GroupedOption[] => {
  return autoinstallFiles.map((autoinstallFile) => {
    return {
      value: autoinstallFile.id.toString(),
      label: autoinstallFile.filename,
    };
  });
};
