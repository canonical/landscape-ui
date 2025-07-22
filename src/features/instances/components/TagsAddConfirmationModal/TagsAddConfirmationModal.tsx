import LoadingState from "@/components/layout/LoadingState";
import type { ProfileChange } from "@/features/tags";
import { useGetProfileChanges } from "@/features/tags";
import type { InstanceWithoutRelation } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import {
  ConfirmationModal,
  Icon,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { type ComponentProps, type FC, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useCounter } from "usehooks-ts";
import TagsAddPagination from "./components/TagsAddPagination";
import { PAGE_SIZE } from "./constants";

interface TagsAddConfirmationModalProps
  extends Omit<
    ComponentProps<typeof ConfirmationModal>,
    "children" | "confirmButtonLabel" | "title"
  > {
  readonly instances: InstanceWithoutRelation[];
  readonly profileChangesCount: number;
  readonly tags: string[];
}

const TagsAddConfirmationModal: FC<TagsAddConfirmationModalProps> = ({
  instances,
  profileChangesCount,
  tags,
  ...props
}) => {
  const {
    count: currentPage,
    decrement: decrementCurrentPage,
    increment: incrementCurrentPage,
  } = useCounter(1);

  const { isPendingProfileChanges, profileChanges } = useGetProfileChanges({
    instance_ids: instances.map((instance) => instance.id),
    tags,
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
  });

  const modalColumns = useMemo<Column<ProfileChange>[]>(
    () =>
      [
        tags.length > 1
          ? {
              Header: "Tag",
              Cell: ({
                row: { original: profileChange },
              }: CellProps<ProfileChange>) => profileChange.tag,
            }
          : null,
        {
          Header: "Active profiles",
          Cell: ({
            row: { original: profileChange },
          }: CellProps<ProfileChange>) => profileChange.profile.name,
        },
        {
          Header: "Profile type",
          Cell: ({
            row: { original: profileChange },
          }: CellProps<ProfileChange>) =>
            ({
              ChildInstanceProfile: "WSL",
              PackageProfile: "Package",
              RebootProfile: "Reboot",
              RemovalProfile: "Removal",
              RepositoryProfile: "Repository",
              ScriptProfile: "Script",
              UpgradeProfile: "Upgrade",
              UsgProfile: "Security",
            })[profileChange.profile.profile_type],
        },
        {
          Header: "Associated instances",
          Cell: ({
            row: { original: profileChange },
          }: CellProps<ProfileChange>) => {
            const label = `${profileChange.profile.current_associated_instances} ${pluralize(
              profileChange.profile.current_associated_instances,
              "instance",
            )}`;

            return profileChange.profile.will_exceed_limit ? (
              <Tooltip
                message={`Adding ${pluralize(instances.length, "this instance", "these instances")} will exceed the instance limit.`}
              >
                <Icon name="warning" />
                {label}
              </Tooltip>
            ) : (
              label
            );
          },
          getCellIcon: ({
            row: { original: profileChange },
          }: CellProps<ProfileChange>) =>
            profileChange.profile.will_exceed_limit ? "" : null,
        },
      ].filter((column) => column != null),
    [],
  );

  const maximumPage = Math.ceil(profileChangesCount / PAGE_SIZE);

  return (
    <ConfirmationModal
      title={`Add ${pluralize(tags.length, `"${tags[0]}" tag`, `${tags.length} tags`)} to ${pluralize(instances.length, `"${instances[0].title}"`, `${instances.length} instances`)}`}
      confirmButtonLabel="Add tags"
      {...props}
    >
      <p>Adding tags could trigger irreversible changes to your instances.</p>

      <p>
        Adding{" "}
        {pluralize(
          tags.length,
          `the ${tags[0]} tag`,
          `these ${tags.length} tags`,
        )}{" "}
        to{" "}
        {pluralize(
          instances.length,
          `the ${instances[0].title} instance`,
          `${instances.length} instances`,
        )}{" "}
        will associate the {pluralize(instances.length, "instance")} with the
        following profiles.
      </p>

      <p>
        Some instances might not be associated with certain profiles due to
        restrictions.
      </p>

      {isPendingProfileChanges ? (
        <LoadingState />
      ) : (
        <ModularTable
          className="u-no-margin--bottom"
          columns={modalColumns}
          data={profileChanges}
        />
      )}

      {maximumPage > 1 && (
        <TagsAddPagination
          max={maximumPage}
          current={currentPage}
          onPrev={decrementCurrentPage}
          onNext={incrementCurrentPage}
        />
      )}
    </ConfirmationModal>
  );
};

export default TagsAddConfirmationModal;
