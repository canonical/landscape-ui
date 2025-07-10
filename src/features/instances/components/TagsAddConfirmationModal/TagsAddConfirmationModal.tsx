import LoadingState from "@/components/layout/LoadingState";
import type { ProfileChange } from "@/features/tags";
import { useGetProfileChanges } from "@/features/tags";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import {
  Button,
  ConfirmationModal,
  Icon,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { useMemo, type ComponentProps, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { useCounter } from "usehooks-ts";
import { PAGE_SIZE } from "./constants";
import classes from "./TagsAddConfirmationModal.module.scss";

interface TagsAddConfirmationModalProps
  extends Omit<
    ComponentProps<typeof ConfirmationModal>,
    "children" | "confirmButtonLabel" | "title"
  > {
  readonly instances: Instance[];
  readonly tags: string[];
}

const TagsAddConfirmationModal: FC<TagsAddConfirmationModalProps> = ({
  instances,
  tags,
  ...props
}) => {
  const {
    count: currentPage,
    decrement: decrementCurrentPage,
    increment: incrementCurrentPage,
  } = useCounter(DEFAULT_CURRENT_PAGE);

  const { isPendingProfileChanges, profileChanges, profileChangesCount } =
    useGetProfileChanges({
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
          }: CellProps<ProfileChange>) => profileChange.profile.profile_type,
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
      title={`Add ${pluralize(tags.length, `${tags[0]}`, `${tags.length} tags`)} to ${pluralize(instances.length, `${instances[0].title}`, `${instances.length} instances`)}`}
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
        <>
          <ModularTable
            className="u-no-margin--bottom"
            columns={modalColumns}
            data={profileChanges}
          />

          <hr />

          <div className={classes.pagination}>
            <div>
              <Button
                className="u-no-margin--right"
                appearance="base"
                hasIcon
                onClick={decrementCurrentPage}
                disabled={currentPage <= DEFAULT_CURRENT_PAGE}
              >
                <Icon name="chevron-left" />
              </Button>
              Page {currentPage} of {maximumPage}
              <Button
                appearance="base"
                hasIcon
                onClick={incrementCurrentPage}
                disabled={currentPage >= maximumPage}
              >
                <Icon name="chevron-right" />
              </Button>
            </div>
          </div>
        </>
      )}
    </ConfirmationModal>
  );
};

export default TagsAddConfirmationModal;
