import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import type { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  title: "",
  access_group: DEFAULT_ACCESS_GROUP_NAME,
  description: "",
  instanceType: "",
  customImageName: "",
  rootfsImage: "",
  cloudInitType: "",
  cloudInit: null,
  all_computers: false,
  tags: [],
};
