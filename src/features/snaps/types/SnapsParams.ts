export interface SnapChangeArgs {
  channel?: string;
  revision?: string;
  classic?: boolean;
  time?: string;
}

export interface SnapChange {
  name: string;
  args?: SnapChangeArgs;
}

export interface GetAvailableSnapInfoParams {
  instance_id: number;
  name: string;
}

export interface SnapActionParams {
  action: string;
  computer_ids: number[];
  snaps: SnapChange[];
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
