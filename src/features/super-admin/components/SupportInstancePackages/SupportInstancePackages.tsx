import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Packages tab of an instance in a support session. */
const SupportInstancePackages: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Packages" />
);

export default SupportInstancePackages;
