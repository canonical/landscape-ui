export interface StaffPersonAccount {
  account: string;
  company: string;
  salesforce_account_key: string | null;
}

export interface StaffPendingInvitation {
  account: string;
  company: string;
  creation_time: string;
}

export interface StaffPersonResult {
  type: "person";
  id: number;
  name: string;
  email: string;
  /** The SSO identity; `null` when the person never completed an SSO login. */
  identity: string | null;
  last_login_time: string | null;
  accounts: StaffPersonAccount[];
  /** Invitations addressed to this person's email, in any account. */
  pending_invitations: StaffPendingInvitation[];
}

export interface StaffInvitationResult {
  type: "invitation";
  id: number;
  name: string;
  email: string;
  account: string;
  company: string;
  salesforce_key: string | null;
  creation_time: string;
}

export type StaffPeopleResult = StaffPersonResult | StaffInvitationResult;

export type StaffPeopleResultType = StaffPeopleResult["type"];
