export type Breadcrumb =
  | {
      label: string;
      path: string;
      current?: false;
    }
  | {
      label: string;
      current: true;
    };
