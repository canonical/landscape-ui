interface AffectedSnap {
  name: string;
  channel?: string;
  revision?: string;
  time?: string;
}

export interface GetAvailableSnapInfoParams {
  instance_id: number;
  name: string;
}

export interface SnapActionParams {
  action: string;
  computer_ids: number[];
  snaps: AffectedSnap[];
  deliver_after?: string;
  deliver_after_window?: number;
}

export interface GetSnapsParams {
  instance_id: number;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface GetAvailableSnapsParams {
  instance_id: number;
  query: string;
}
