import { AUTOINSTALL_FILE_LANGUAGES } from "./constants";

export const removeAutoinstallFileExtension = (filename: string): string => {
  return filename.replace(
    new RegExp(`\\.(${AUTOINSTALL_FILE_LANGUAGES.join("|")})$`),
    "",
  );
};
