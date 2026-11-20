import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Kernel tab of an instance in a support session. */
const SupportInstanceKernel: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Kernel" />
);

export default SupportInstanceKernel;
