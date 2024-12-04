export interface GetActivitiesParams {
  limit?: number;
  offset?: number;
  query?: string;
}

export interface GetSingleActivityParams {
  activityId: number;
}

export interface CancelActivitiesParams {
  query: string;
}

export interface ApproveActivitiesParams {
  query: string;
}

export interface RedoUndoActivitiesParams {
  activity_ids: number[];
}
