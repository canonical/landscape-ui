import type { ReactNode } from "react";

export interface Term extends Record<string, unknown> {
  term: ReactNode;
  description: ReactNode;
}
