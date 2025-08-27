import type { Attributes, SuspenseProps as SuspenseBaseProps } from "react";
import { Suspense as SuspenseBase, type FC } from "react";
import LoadingState from "./LoadingState";

export type SuspenseProps = SuspenseBaseProps & Attributes;

const Suspense: FC<SuspenseProps> = ({ ...props }) => (
  <SuspenseBase fallback={<LoadingState />} {...props} />
);

export default Suspense;
