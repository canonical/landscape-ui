import { ReactNode } from "react";

type FluidContainer = {
  container?: "fluid";
  align?: never;
};

type MediumContainer = {
  container: "medium";
  align?: "center" | "left";
};

type BasePageContentProps = {
  children: ReactNode;
};

export type PageContentProps = BasePageContentProps &
  (FluidContainer | MediumContainer);
