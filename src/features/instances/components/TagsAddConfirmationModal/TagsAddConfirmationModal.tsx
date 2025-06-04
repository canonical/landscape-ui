import type { SecurityProfile } from "@/features/security-profiles";
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "@/features/security-profiles";
import type { Instance } from "@/types/Instance";
import {
  ConfirmationModal,
  Icon,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { useMemo, type ComponentProps, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { willBeOverLimit } from "./helpers";
import { pluralize } from "@/utils/_helpers";

interface TagsAddConfirmationModalProps
  extends Omit<
    ComponentProps<typeof ConfirmationModal>,
    "children" | "confirmButtonLabel" | "title"
  > {
  readonly instances: Instance[];
  readonly securityProfiles: SecurityProfile[];
  readonly tags: string[];
}

const TagsAddConfirmationModal: FC<TagsAddConfirmationModalProps> = ({
  instances,
  securityProfiles,
  tags,
  ...props
}) => {
  const modalColumns = useMemo<Column<SecurityProfile>[]>(
    () =>
      [
        tags.length > 1
          ? {
              Header: "Tag",
              Cell: ({
                row: { original: profile },
              }: CellProps<SecurityProfile>) =>
                tags.find((tag) => profile.tags.includes(tag)),
            }
          : null,
        {
          Header: "Active profiles",
          Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) =>
            profile.title,
        },
        {
          Header: "Profile type",
          Cell: () => "Security",
        },
        {
          Header: "Associated instances",
          Cell: ({
            row: { original: profile },
          }: CellProps<SecurityProfile>) => (
            <Tooltip
              message={
                willBeOverLimit(profile, instances)
                  ? `Adding this instance will exceed the ${SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT} instance limit`
                  : null
              }
            >
              {willBeOverLimit(profile, instances) && <Icon name="warning" />}
              {profile.associated_instances ?? 0}{" "}
              {pluralize(profile.associated_instances, "instance")}
            </Tooltip>
          ),
          getCellIcon: ({
            row: { original: profile },
          }: CellProps<SecurityProfile>) =>
            willBeOverLimit(profile, instances) ? "" : null,
        },
      ].filter((column) => column != null),
    [],
  );

  return (
    <ConfirmationModal
      title={`Add ${tags.length > 1 ? `${tags.length} tags` : `${tags[0]} tag`} to ${instances.length > 1 ? `${instances.length} instances` : `${instances[0].title} instance`}`}
      confirmButtonLabel="Add tags"
      {...props}
    >
      <p>Adding tags could trigger irreversible changes to your instances.</p>

      <p>
        Adding{" "}
        {tags.length > 1 ? `these ${tags.length} tags` : `the ${tags[0]} tag`}{" "}
        to{" "}
        {instances.length > 1
          ? `${instances.length} instances`
          : `the ${instances[0].title} instance`}{" "}
        will associate the {pluralize(instances.length, "instance")} with the
        following profiles.
        {securityProfiles.some((profile) =>
          willBeOverLimit(profile, instances),
        ) && (
          <>
            {" "}
            One or more of these profiles will exceed the{" "}
            <strong>
              {SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT} instance limit
            </strong>{" "}
            and will stop running across all associated instances.
          </>
        )}
      </p>

      <ModularTable columns={modalColumns} data={securityProfiles} />
    </ConfirmationModal>
  );
};

export default TagsAddConfirmationModal;
