export interface SubscriptionParams {
  alert_type: string;
}

export interface AssociateAlertParams {
  name: string;
  all_computers?: boolean;
  tags?: string[];
}

export interface DisassociateAlertParams {
  name: string;
  all_computers?: boolean;
  tags?: string[];
}
