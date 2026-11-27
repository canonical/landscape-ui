import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Snaps tab of an instance in a support session. */
const SupportInstanceSnaps: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Snaps" />
);

export default SupportInstanceSnaps;
