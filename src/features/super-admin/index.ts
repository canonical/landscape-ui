export type {
  FeatureRegistryEntry,
  StaffAccount,
  StaffAccountAdministrator,
  StaffAccountLicense,
  StaffAccountListItem,
  StaffInvitationResult,
  StaffPendingInvitation,
  StaffPeopleResult,
  StaffPeopleResultType,
  StaffPersonAccount,
  StaffPersonResult,
  WslFeatureLimits,
} from "./types";

export type {
  EditStaffAccountParams,
  EditStaffAccountWslLimitsParams,
  GetStaffAccountsParams,
  GetStaffPeopleParams,
} from "./api";
export {
  useEditStaffAccount,
  useEditStaffAccountWslLimits,
  useGetFeatureRegistry,
  useGetStaffAccount,
  useGetStaffAccounts,
  useGetStaffAccountWslLimits,
  useGetStaffPeople,
} from "./api";

export {
  useEnterAccount,
  useExitSupportSession,
  useOwnAccount,
  useRestoreOwnAccount,
} from "./hooks";

export { default as StaffAccountContainer } from "./components/StaffAccountContainer";
export { isTableTab } from "./components/StaffAccountTabs";
export { default as StaffAccountsContainer } from "./components/StaffAccountsContainer";
export { default as SupportSessionContainer } from "./components/SupportSessionContainer";
export { default as SupportProfiles } from "./components/SupportProfiles";
export { SUPPORT_PROFILE_PAGES } from "./constants";
export type { SupportProfilePage } from "./constants";
