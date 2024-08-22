import { InstancePackage } from "../../types";

export const highlightVersionsDifference = (pkg: InstancePackage) => {
  if (!pkg.available_version) {
    return "";
  }

  if (!pkg.current_version || pkg.current_version === pkg.available_version) {
    return pkg.available_version;
  }

  for (let i = 0; i < pkg.available_version.length; i++) {
    if (pkg.current_version[i] !== pkg.available_version[i]) {
      return (
        <>
          <span>{pkg.available_version.slice(0, i)}</span>
          <b>{pkg.available_version.slice(i)}</b>
        </>
      );
    }
  }
};
