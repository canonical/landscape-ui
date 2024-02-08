export interface User extends Record<string, any> {
  enabled: boolean;
  home_phone?: string;
  location?: string;
  name: string;
  primary_gid: number;
  uid: number;
  username: string;
  work_phone?: string;
}

export interface Group {
  id: number;
  computer_id: number;
  gid: number;
  name: string;
}

export interface GroupsResponse {
  groups: Group[];
}
