import type { FC } from "react";
import type { SupportInstanceTabProps } from "../../types";
import SupportInstanceTabPlaceholder from "../SupportInstanceTabPlaceholder";

/** The Users tab of an instance in a support session. */
const SupportInstanceUsers: FC<SupportInstanceTabProps> = () => (
  <SupportInstanceTabPlaceholder tab="Users" />
);

export default SupportInstanceUsers;
