import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Processes tab of an instance in a support session. */
const SupportInstanceProcesses: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Processes" />
);

export default SupportInstanceProcesses;
