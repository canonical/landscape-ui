import * as Yup from "yup";
import type { InstalledPackageAction, InstancePackage } from "../../types";
import { pluralize } from "@/utils/_helpers";
import {
  randomizationValidationSchema,
  deliveryValidationSchema,
} from "@/components/form/DeliveryScheduling";

export const getValidationSchema = (action: InstalledPackageAction) =>
  Yup.object({
    ...randomizationValidationSchema,
    ...deliveryValidationSchema,
    version: Yup.string().test({
      name: "required",
      message: "This field is required",
      params: { action },
      test: (value) => action !== "downgrade" || !!value,
    }),
  });

export const getActionInfo = (
  packages: InstancePackage[],
  action: "hold" | "unhold",
) => {
  const title = pluralize(
    packages.length,
    `${packages[0]?.name ?? ""} Package`,
    "selected packages",
  );

  return `This will ${action === "hold" ? "disable" : "enable"} upgrades for the ${title}. It will ${action === "hold" ? "not " : ""}be eligible to upgrade to the latest available version.`;
};

export const getActionSuccessNotificationProps = (
  action: InstalledPackageAction,
  packages: InstancePackage[],
  version: string,
) => {
  const itemTitle = pluralize(
    packages.length,
    `${packages[0]?.name ?? ""} Package`,
    "selected packages",
  );

  const titleEnding: Record<InstalledPackageAction, string> = {
    downgrade: "downgrade",
    hold: "held",
    remove: "uninstall",
    unhold: "unheld",
    upgrade: "upgrade",
  };

  const messageEnding: Record<InstalledPackageAction, string> = {
    downgrade: `be downgraded to ${version} version`,
    hold: "disable its upgrades",
    remove: "be uninstalled",
    unhold: "enable its upgrades",
    upgrade: "be upgraded",
  };

  const title = `You queued ${itemTitle} to ${action !== "remove" ? "be " : ""}${titleEnding[action]}.`;
  const message = `${itemTitle} ${packages.length > 1 ? "are" : "is"} queued in Activities and will ${messageEnding[action]}.`;

  return { title, message };
};
