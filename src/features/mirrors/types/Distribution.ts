export interface Component {
  slug: string;
  preselected: boolean;
}

export interface Architecture {
  slug: string;
  preselected: boolean;
}

export interface Distribution {
  slug: string;
  label: string;
  preselected: boolean;
  components: Component[];
  architectures: Architecture[];
}
