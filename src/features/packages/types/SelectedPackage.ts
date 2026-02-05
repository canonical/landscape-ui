export interface SelectedPackage {
  name: string;
  id: number;
  versions: SelectedVersion[];
}

export interface SelectedVersion {
  name: string;
  source?: string;
}
