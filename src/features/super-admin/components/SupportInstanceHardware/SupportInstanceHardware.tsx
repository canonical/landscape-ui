import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Hardware tab of an instance in a support session. */
const SupportInstanceHardware: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Hardware" />
);

export default SupportInstanceHardware;
