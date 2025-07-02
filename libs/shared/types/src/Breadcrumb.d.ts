export type Breadcrumb =
  | {
      label: string;
      path: string;
      current?: false;
    }
  | {
      current: true;
      label: string;
    };
