import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { useGetProfileChanges } from "@/features/tags";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import {
  CheckboxInput,
  ModularTable,
  SearchBox,
} from "@canonical/react-components";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import TagsAddConfirmationModal from "../TagsAddConfirmationModal";

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

  const [tags, setTags] = useState<string[]>([]);

  const {
    isFetchingProfileChanges,
    profileChangesCount,
    refetchProfileChanges,
  } = useGetProfileChanges(
    {
      instance_ids: selected.map((instance) => instance.id),
      tags,
      limit: 10,
      offset: 0,
    },
    { enabled: false },
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const { mutateAsync: addTagsToInstances, isPending: isAddingTags } =
    addTagsToInstancesQuery;
  const { data: getAllInstanceTagsQueryResult, isLoading: isLoadingTags } =
    getAllInstanceTagsQuery();

  const addTags = async () => {
    try {
      await addTagsToInstances({
        query: selected.map(({ id }) => `id:${id}`).join(" OR "),
        tags,
      });

      closeSidePanel();

      notify.success({
        title: "Tags assigned",
        message: `Tags successfully assigned to ${pluralize(
          selected.length,
          `"${selected[0]?.title ?? ""}" instance`,
          `${selected.length} instances`,
        )}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const submit = async () => {
    const getProfileChangesResponse = await refetchProfileChanges();

    if (!getProfileChangesResponse.isSuccess) {
      debug(getProfileChangesResponse.error);
      return;
    }

    if (getProfileChangesResponse.data.data.count) {
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
            index,
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
            <CheckboxInput
              inline
              label={tag}
              disabled={selected.every((instance) =>
                instance.tags.includes(tag),
              )}
              name={`tag-${index}`}
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
          );
        },
      },
    ],
    [tags, filteredTags],
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
        submitButtonDisabled={!tags.length}
        submitButtonLoading={isAddingTags || isFetchingProfileChanges}
        submitButtonText="Assign"
      />

      {isModalVisible && (
        <TagsAddConfirmationModal
          instances={selected}
          tags={tags}
          onConfirm={addTags}
          confirmButtonLoading={isAddingTags}
          close={closeModal}
          profileChangesCount={profileChangesCount}
        />
      )}
    </>
  );
};

export default TagsAddForm;
