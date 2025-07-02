import type { ReactNode } from "react";

interface FluidContainer {
  container?: "fluid";
  align?: never;
}

interface MediumContainer {
  container: "medium";
  align?: "center" | "left";
}

interface BasePageContentProps {
  children: ReactNode;
}

export type PageContentProps = BasePageContentProps &
  (FluidContainer | MediumContainer);
