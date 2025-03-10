import { AUTOINSTALL_FILE_EXTENSION } from "./constants";

export const removeAutoinstallFileExtension = (filename: string): string => {
  return filename.replace(new RegExp(`${AUTOINSTALL_FILE_EXTENSION}$`), "");
};
