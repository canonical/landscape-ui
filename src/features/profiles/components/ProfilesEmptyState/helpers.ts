import type { ProfileType } from "../../types";

export const getMessage = (type: ProfileType) => {
  switch (type) {
    case 'package':
      return "Package profiles allow you to specify sets of packages that associated instances should always get, or never get. They are managed using package constraints, which are the packages that the profile depends on or conflicts with.";
    case 'repository':
      return "Repository mirroring lets you establish custom repositories from your local mirror, giving you more control over the software versions available to your machines. Repository profiles allow you to update repository configurations.";
    case 'reboot':
      return "Regular reboots keep your system healthy and secure by applying the latest updates. They also help maintain Livepatch coverage. Add a reboot profile to automate this process for your instances.";
    case 'removal':
      return "Removal profiles define a maximum number of days that a computer can go without exchanging data with the Landscape server before it is automatically removed. This helps Landscape keep license seats open and avoid tracking stale or retired computer data for long periods of time.";
    case 'script':
      return "Script profiles allow you to automate your script runs based on triggers. Triggers can be either a recurring schedule, on a set date, or before or after an event.";
    case 'security':
      return "Add a security profile to ensure security and compliance across your instances. Security profile audits aggregate audit results over time and in bulk, helping you align with tailored security benchmarks, run scheduled audits, and generate detailed audits for your estate.";
    case 'upgrade':
      return "Upgrade profiles allow you to schedule when upgrades should be automatically installed on associated machines.";
    case 'wsl':
      return "WSL profiles define a single Ubuntu WSL instance that should be installed on Windows host machines. You must have a Windows host machine registered with Landscape before making any WSL instances.";
  }
};

export const getLink = (type: ProfileType) => {
  switch (type) {
    case 'repository':
      return { text: "How to manage repositories in Landscape.", url: "https://ubuntu.com/landscape/docs/manage-repositories-web-portal" };
    case 'reboot':
      return { text: "Learn more about Livepatch", url: "https://ubuntu.com/security/livepatch/docs" };
    case 'wsl':
      return { text: "How to manage WSL profiles in Landscape.", url: "https://ubuntu.com/landscape/docs/manage-wsl-instances-in-landscape" };
    default:
      return undefined;
  }
};
