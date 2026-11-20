import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The WSL tab of an instance in a support session. */
const SupportInstanceWsl: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="WSL" />
);

export default SupportInstanceWsl;
