import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Security issues tab of an instance in a support session. */
const SupportInstanceSecurityIssues: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Security issues" />
);

export default SupportInstanceSecurityIssues;
