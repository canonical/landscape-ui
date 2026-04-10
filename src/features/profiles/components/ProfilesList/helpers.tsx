import { Icon, ICONS, Tooltip } from "@canonical/react-components";
import type { Profile, ProfileActions } from "../../types";
import {
  getTriggerText,
  isPackageProfile,
  isProfileArchived,
  isRebootProfile,
  isRemovalProfile,
  isScriptProfile,
  isSecurityProfile,
  isWslProfile,
  type ProfileTypes,
} from "../../helpers";
import ProfileAssociatedInstancesLink from "../ProfileAssociatedInstancesLink";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import { getTitleByName } from "@/utils/_helpers";
import { Button, Link } from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import ProfilesListActions from "./components/ProfilesListActions";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ROUTES } from "@/libs/routes";
import type { AxiosResponse } from "axios";
import type { ScriptProfile } from "@/features/script-profiles";
import {
  type SecurityProfile,
  SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT,
  SECURITY_PROFILE_MODE_LABELS,
  SecurityProfileAuditPassRate,
  SecurityProfileLastRunWithSchedule,
} from "@/features/security-profiles";
import AssociatedInstancesCell from "./components/AssociatedInstancesCell";

const getStatus = (profile: ScriptProfile | SecurityProfile) => {
  if (isProfileArchived(profile)) {
    return { label: "Archived", icon: "status-queued-small" };
  }

  if (
    isSecurityProfile(profile) &&
    profile.associated_instances > SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT
  ) {
    return {
      label: (
        <div style={{ display: "inline-flex", gap: "1rem" }}>
          <span>Over limit</span>
          <Tooltip
            position="top-center"
            message="Only the first 5,000 instances are covered. Instances beyond the limit are not covered."
          >
            <div style={{ transform: "translateX(16px)" }}>
              <Icon name={ICONS.help} />
            </div>
          </Tooltip>
        </div>
      ),
      icon: "status-failed-small",
    };
  }

  return { label: "Active", icon: "status-succeeded-small" };
};

type ColumnNames = "name" | "accessGroup" | "associated" | "actions";

export const getGeneralColumns = (
  type: ProfileTypes,
  onNameClick: (profile: Profile, action: ProfileActions) => void,
  accessGroupData: AxiosResponse | undefined,
): Record<ColumnNames, Column<Profile>> => ({
  name: {
    accessor: "title",
    Header: "Profile name",
    id: "title",
    meta: {
      ariaLabel: ({ original: profile }) => `"${profile.title}" profile name`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => (
      <Button
        type="button"
        appearance="link"
        className="u-no-margin--bottom u-no-padding--top u-align-text--left"
        onClick={() => {
          onNameClick(profile, "view");
        }}
        aria-label={`Open "${profile.title}" profile details`}
      >
        {profile.title}
      </Button>
    ),
  },
  accessGroup: {
    accessor: "access_group",
    Header: "Access group",
    meta: {
      ariaLabel: ({ original: profile }) =>
        `"${profile.title}" profile access group`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) =>
      getTitleByName(profile.access_group, accessGroupData),
  },
  associated: {
    accessor: "associated",
    Header: "Associated",
    meta: {
      ariaLabel: ({ original: profile }) =>
        `"${profile.title}" profile associated instances`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => (
      <AssociatedInstancesCell type={type} profile={profile} />
    ),
  },
  actions: {
    ...LIST_ACTIONS_COLUMN_PROPS,
    meta: {
      ariaLabel: ({ original: profile }) =>
        `"${profile.title}" profile actions`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => (
      <ProfilesListActions profile={profile} type={type} />
    ),
  },
});

export const getStatusColumn = (): Column<Profile> => ({
  Header: "Status",
  accessor: (row) => (isSecurityProfile(row) ? "status" : "archived"),
  meta: {
    ariaLabel: ({ original: profile }) => `"${profile.title}" profile status`,
  },
  getCellIcon: ({ row: { original: profile } }: CellProps<Profile>) => {
    if (isSecurityProfile(profile) || isScriptProfile(profile)) {
      return getStatus(profile).icon;
    }
  },
  Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
    if (isSecurityProfile(profile) || isScriptProfile(profile)) {
      return getStatus(profile).label;
    }
  },
});

export const getComplianceColumns = (type: ProfileTypes): Column<Profile>[] => [
  {
    Header: "Compliant",
    meta: {
      ariaLabel: ({ original }) =>
        `${original.title} profile compliant instances`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
      if (isWslProfile(profile) || isPackageProfile(profile)) {
        return (
          <ProfileAssociatedInstancesLink
            profile={profile}
            count={
              profile.computers.constrained.length -
              profile.computers["non-compliant"].length
            }
            query={`${type}:${profile.id}:compliant`}
          />
        );
      }
    },
  },
  {
    Header: "Not compliant",
    meta: {
      ariaLabel: ({ original: profile }) =>
        `"${profile.title}" profile non-compliant instances`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
      if (isWslProfile(profile) || isPackageProfile(profile)) {
        return (
          <ProfileAssociatedInstancesLink
            profile={profile}
            count={profile.computers["non-compliant"].length}
            query={`${type}:${profile.id}:noncompliant`}
          />
        );
      }
    },
  },
];

export const getSecurityColumns = (): Column<Profile>[] => [
  {
    accessor: "last_run_results",
    className: "medium-cell",
    Header: "Pass rate",
    meta: {
      ariaLabel: ({ original: profile }) =>
        `"${profile.title}" profile last audit pass rate`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
      if (isSecurityProfile(profile)) {
        return <SecurityProfileAuditPassRate profile={profile} />;
      }
    },
  },
  {
    accessor: "schedule",
    Header: (
      <div>
        Last run
        <br />
        <span className="u-text--muted">Schedule</span>
      </div>
    ),
    meta: {
      ariaLabel: ({ original: profile }) =>
        `"${profile.title}" profile last run and schedule`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
      if (isSecurityProfile(profile)) {
        return <SecurityProfileLastRunWithSchedule profile={profile} />;
      }
    },
  },
  {
    accessor: "mode",
    Header: "Mode",
    meta: {
      ariaLabel: ({ original: profile }) => `"${profile.title}" profile mode`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
      if (isSecurityProfile(profile)) {
        return SECURITY_PROFILE_MODE_LABELS[profile.mode];
      }
    },
  },
];

export const getScriptColumns = (): Column<Profile>[] => [
  {
    Header: "Last run",
    accessor: "activities.last_activity.creation_time",
    meta: {
      ariaLabel: ({ original: profile }) =>
        `"${profile.title}" profile last run`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
      if (isScriptProfile(profile)) {
        const { last_activity } = profile.activities;
        return last_activity ? (
          <Link
            href={ROUTES.activities.root({
              query: `parent-id:${last_activity.id}`,
            })}
          >
            {moment(last_activity.creation_time)
              .utc()
              .format(DISPLAY_DATE_TIME_FORMAT)}
          </Link>
        ) : (
          <NoData />
        );
      }
    },
  },
  {
    Header: "Trigger",
    accessor: "trigger",
    meta: {
      ariaLabel: ({ original: profile }) =>
        `"${profile.title}" profile trigger`,
    },
    Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
      if (isScriptProfile(profile)) {
        return getTriggerText(profile);
      }
    },
  },
];

export const getRebootColumn = (): Column<Profile> => ({
  accessor: "next_run",
  Header: "Next restart",
  meta: {
    ariaLabel: ({ original: profile }) =>
      `"${profile.title}" profile next restart`,
  },
  Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
    if (isRebootProfile(profile)) {
      return moment(profile.next_run).utc().format(DISPLAY_DATE_TIME_FORMAT);
    }
  },
});

export const getRemovalColumn = (): Column<Profile> => ({
  accessor: "days_without_exchange",
  Header: "Removal timeframe",
  meta: {
    ariaLabel: ({ original: profile }) =>
      `"${profile.title}" profile removal timeframe`,
  },
  Cell: ({ row: { original: profile } }: CellProps<Profile>) => {
    if (isRemovalProfile(profile)) {
      return `${profile.days_without_exchange} days`;
    }
  },
});
