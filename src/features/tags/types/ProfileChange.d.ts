export interface ProfileChange extends Record<string, unknown> {
  tag: string;
  profile: {
    current_associated_instances: number;
    name: string;
    profile_type:
      | "package_profile"
      | "reboot_profile"
      | "removal_profile"
      | "repository_profile"
      | "upgrade_profile"
      | "script_profile"
      | "security_profile"
      | "wsl_profile";
    will_exceed_limit: boolean;
    will_exclude_instances: boolean;
  };
}
