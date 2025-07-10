export interface ProfileChange extends Record<string, unknown> {
  tag: string;
  profile: {
    current_associated_instances: number;
    name: string;
    profile_type:
      | "ChildInstanceProfile"
      | "PackageProfile"
      | "RebootProfile"
      | "RemovalProfile"
      | "RepositoryProfile"
      | "ScriptProfile"
      | "UpgradeProfile"
      | "UsgProfile";
    will_exceed_limit: boolean;
    will_exclude_instances: boolean;
  };
}
