import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import type { SecurityProfile } from "@/features/security-profiles";
import {
  SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT,
  useGetSecurityProfiles,
} from "@/features/security-profiles";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import {
  CheckboxInput,
  ConfirmationModal,
  ModularTable,
  SearchBox,
} from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import {
  finalAssociatedInstanceCount,
  instancesToAssignCount,
  willBeOverLimit,
} from "./helpers";

interface TagsAddFormProps {
  readonly selected: Instance[];
}

interface TagObject extends Record<string, unknown> {
  value: string;
}

const TagsAddForm: FC<TagsAddFormProps> = ({ selected }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const { addTagsToInstancesQuery, getAllInstanceTagsQuery } = useInstances();
  const { mutateAsync: addTagsToInstances, isPending: isAddingTags } =
    addTagsToInstancesQuery;
  const { data: getAllInstanceTagsQueryResult, isLoading: isLoadingTags } =
    getAllInstanceTagsQuery();
  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({ statuses: ["active"] });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const filteredSecurityProfiles = securityProfiles.filter(
    (profile) =>
      profile.tags.some((tag) => tags.includes(tag)) &&
      instancesToAssignCount(profile, selected),
  );

  const addTags = async () => {
    try {
      await addTagsToInstances({
        query: selected.map(({ id }) => `id:${id}`).join(" OR "),
        tags,
      });

      closeSidePanel();

      notify.success({
        title: "Tags assigned",
        message: `Tags successfully assigned to ${
          selected.length > 1
            ? `${selected.length} instances`
            : `"${selected[0].title}" instance`
        }`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const submit = async () => {
    if (filteredSecurityProfiles.length) {
      setIsModalVisible(true);
    } else {
      await addTags();
    }
  };

  const filteredTags =
    getAllInstanceTagsQueryResult?.data.results.filter((value) =>
      value.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  const toggleAll = () => {
    if (filteredTags.every((tag) => tags.includes(tag))) {
      setTags([]);
    } else {
      setTags(filteredTags);
    }
  };

  const columns = useMemo<Column<TagObject>[]>(
    () => [
      {
        accessor: "value",
        Header: (
          <>
            <CheckboxInput
              inline
              label={null}
              disabled={filteredTags.every((tag) =>
                selected.every((instance) => instance.tags.includes(tag)),
              )}
              checked={filteredTags.every(
                (tag) =>
                  tags.includes(tag) ||
                  selected.every((instance) => instance.tags.includes(tag)),
              )}
              indeterminate={
                filteredTags.some((tag) =>
                  selected.some((instance) => !instance.tags.includes(tag)),
                ) &&
                filteredTags.some((tag) =>
                  selected.some((instance) => instance.tags.includes(tag)),
                )
              }
              onChange={toggleAll}
            />
            Name
          </>
        ),
        Cell: ({
          row: {
            original: { value: tag },
          },
        }: CellProps<TagObject>) => {
          const toggle = () => {
            if (tags.includes(tag)) {
              setTags(
                tags.toSpliced(
                  tags.findIndex((t) => t == tag),
                  1,
                ),
              );

              return;
            }

            if (selected.every((instance) => instance.tags.includes(tag))) {
              return;
            }

            setTags([...tags, tag]);
          };

          return (
            <>
              <CheckboxInput
                inline
                label={null}
                disabled={selected.every((instance) =>
                  instance.tags.includes(tag),
                )}
                checked={
                  tags.includes(tag) ||
                  selected.every((instance) => instance.tags.includes(tag))
                }
                indeterminate={
                  !tags.includes(tag) &&
                  selected.some((instance) => instance.tags.includes(tag)) &&
                  selected.some((instance) => !instance.tags.includes(tag))
                }
                onChange={toggle}
              />
              {tag}
            </>
          );
        },
      },
    ],
    [tags, filteredTags],
  );

  const modalColumns = useMemo<Column<SecurityProfile>[]>(
    () =>
      [
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
          Cell: ({ row: { original: profile } }: CellProps<SecurityProfile>) =>
            `${finalAssociatedInstanceCount(profile, selected)} ${finalAssociatedInstanceCount(profile, selected) === 1 ? "instance" : "instances"}`,
          getCellIcon: ({
            row: { original: profile },
          }: CellProps<SecurityProfile>) =>
            willBeOverLimit(profile, selected) ? "warning" : undefined,
        },
      ].filter((column) => column),
    [],
  );

  if (isLoadingTags) {
    return <LoadingState />;
  }

  const filteredTagObjects = filteredTags.map<TagObject>((tag) => ({
    value: tag,
  }));

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <p>
        Adding tags will associate the instance with the profiles that tag is
        linked to. This may change configurations on your instance.
      </p>

      <SearchBox
        value={search}
        onChange={(value) => {
          setSearch(value);
        }}
      />

      <ModularTable
        emptyMsg="No tags found"
        columns={columns}
        data={[
          ...filteredTagObjects.filter(({ value }) =>
            value.toLowerCase().startsWith(search.toLowerCase()),
          ),
          ...filteredTagObjects.filter(
            ({ value }) =>
              !value.toLowerCase().startsWith(search.toLowerCase()),
          ),
        ]}
      />

      <SidePanelFormButtons
        onSubmit={submit}
        submitButtonDisabled={
          !tags.length || isAddingTags || isSecurityProfilesLoading
        }
        submitButtonText="Assign"
      />

      {isModalVisible && (
        <ConfirmationModal
          title={`Add ${tags.length > 1 ? `${tags.length} tags` : `${tags[0]} tag`} to ${selected.length > 1 ? `${selected.length} instances` : `${selected[0].title} instance`}`}
          confirmButtonLabel="Add tags"
          onConfirm={addTags}
          confirmButtonDisabled={isAddingTags}
          close={closeModal}
        >
          <p>
            Adding tags could trigger irreversible changes to your instances.
          </p>

          <p>
            Adding{" "}
            {tags.length > 1
              ? `these ${tags.length} tags`
              : `the ${tags[0]} tag`}{" "}
            to{" "}
            {selected.length > 1
              ? `${selected.length} instances`
              : `the ${selected[0].title} instance`}{" "}
            will associate the instance{selected.length > 1 ? "s" : ""} with the
            following profiles.
            {filteredSecurityProfiles.some((profile) =>
              willBeOverLimit(profile, selected),
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

          <ModularTable
            columns={modalColumns}
            data={filteredSecurityProfiles}
          />
        </ConfirmationModal>
      )}
    </>
  );
};

export default TagsAddForm;
