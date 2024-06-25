import { ListFilter } from "@/types/Filters";

type FormKey = "instanceType" | "cloudInit" | "instanceName" | "rootfs";

export const FORM_FIELDS: { [key in FormKey]: ListFilter } = {
  instanceType: {
    slug: "instanceType",
    label: "Instance type",
    type: "select",
    options: [
      {
        label: "Custom",
        value: "custom",
      },
    ],
  },
  cloudInit: {
    slug: "cloudInit",
    label: "Cloud-init",
    type: "file",
  },
  instanceName: {
    slug: "instanceName",
    label: "Instance name",
    type: "text",
  },
  rootfs: {
    slug: "rootfs",
    label: "Rootfs URL",
    type: "text",
  },
};

export const RESERVED_PATTERNS = [
  /^ubuntu$/,
  /^ubuntu-preview$/,
  /^ubuntu-[0-9]{2}\.[0-9]{2}$/,
];
