export interface User extends Record<string, any> {
  enabled: boolean;
  name: string;
  primary_gid: number;
  uid: number;
  username: string;
  home_phone?: string;
  location?: string;
  work_phone?: string;
}

export interface Group {
  computer_id: number;
  gid: number;
  id: number;
  name: string;
}

export interface GroupsResponse {
  groups: Group[];
}
