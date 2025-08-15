import {
  Suspense as SuspenseBase,
  type FC,
  type Key,
  type ReactNode,
} from "react";
import LoadingState from "./LoadingState";

export interface SuspenseProps {
  readonly children: ReactNode;
  readonly key: Key;
}

const Suspense: FC<SuspenseProps> = ({ children, key }) => (
  <SuspenseBase fallback={<LoadingState />} key={key}>
    {children}
  </SuspenseBase>
);

export default Suspense;
