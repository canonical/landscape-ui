import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Activities tab of an instance in a support session. */
const SupportInstanceActivities: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Activities" />
);

export default SupportInstanceActivities;
