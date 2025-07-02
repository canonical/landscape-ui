import moment from "moment/moment";
import * as Yup from "yup";
import type { InstalledPackageAction, InstancePackage } from "../../types";
import { pluralize } from "@/utils/_helpers";

export const getValidationSchema = (action: InstalledPackageAction) =>
  Yup.object({
    deliver_after: Yup.string().when("deliver_immediately", {
      is: false,
      then: (schema) =>
        schema.required("This field is required").test({
          test: (value) =>
            moment(value).isValid() && moment(value).isAfter(moment()),
          message: "You have to enter a valid date and time in the future",
        }),
    }),
    deliver_delay_window: Yup.number().when("randomize_delivery", {
      is: true,
      then: (schema) =>
        schema.min(0, "Delivery delay must be greater than or equal to 0"),
    }),
    deliver_immediately: Yup.boolean(),
    randomize_delivery: Yup.boolean(),
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
