export interface GetAPTSourcesParams {
  names?: string[];
}

export interface CreateAPTSourceParams {
  apt_line: string;
  name: string;
  access_group?: string;
  gpg_key?: string;
}

export interface RemoveAPTSourceParams {
  name: string;
}
