import type { Architecture } from "./Architecture";
import type { Component } from "./Component";

export interface Distribution {
  slug: string;
  label: string;
  preselected: boolean;
  components: Component[];
  architectures: Architecture[];
}
