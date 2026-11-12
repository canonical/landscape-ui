import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Ubuntu Pro tab of an instance in a support session. */
const SupportInstanceUbuntuPro: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Ubuntu Pro" />
);

export default SupportInstanceUbuntuPro;
