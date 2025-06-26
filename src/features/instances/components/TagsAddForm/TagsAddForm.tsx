import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { useGetProfileChanges } from "@/features/tags";
import useDebug from "@/hooks/useDebug";
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
import { useBoolean } from "usehooks-ts";
import { useAddTagsToInstances, useGetTags } from "../../api";
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

  const { addTagsToInstances, isAddingTagsToInstances } =
    useAddTagsToInstances();
  const { tags, isGettingTags } = useGetTags();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    isFetchingProfileChanges,
    profileChangesCount,
    refetchProfileChanges,
  } = useGetProfileChanges(
    {
      instance_ids: selected.map((instance) => instance.id),
      tags,
      limit: 10,
    },
    { enabled: false },
  );

  const {
    value: isModalVisible,
    setFalse: closeModal,
    setTrue: openModal,
  } = useBoolean();

  const [search, setSearch] = useState("");

  const addTags = async () => {
    try {
      await addTagsToInstances({
        query: selected.map(({ id }) => `id:${id}`).join(" OR "),
        tags: selectedTags,
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
      openModal();
    } else {
      await addTags();
    }
  };

  const filteredTags =
    tags.filter((tag) => tag.toLowerCase().includes(search.toLowerCase())) ??
    [];

  const toggleAll = () => {
    if (filteredTags.every((tag) => selectedTags.includes(tag))) {
      setSelectedTags([]);
    } else {
      setSelectedTags(filteredTags);
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
                  selectedTags.includes(tag) ||
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
            if (selectedTags.includes(tag)) {
              setSelectedTags(
                selectedTags.toSpliced(
                  selectedTags.findIndex((t) => t == tag),
                  1,
                ),
              );

              return;
            }

            if (selected.every((instance) => instance.tags.includes(tag))) {
              return;
            }

            setSelectedTags([...selectedTags, tag]);
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
                selectedTags.includes(tag) ||
                selected.every((instance) => instance.tags.includes(tag))
              }
              indeterminate={
                !selectedTags.includes(tag) &&
                selected.some((instance) => instance.tags.includes(tag)) &&
                selected.some((instance) => !instance.tags.includes(tag))
              }
              onChange={toggle}
            />
          );
        },
      },
    ],
    [selectedTags, filteredTags],
  );

  if (isGettingTags) {
    return <LoadingState />;
  }

  const filteredTagObjects = filteredTags.map<TagObject>((tag) => ({
    value: tag,
  }));

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
        submitButtonDisabled={!selectedTags.length}
        submitButtonLoading={
          isAddingTagsToInstances || isFetchingProfileChanges
        }
        submitButtonText="Assign"
      />

      {isModalVisible && (
        <TagsAddConfirmationModal
          instances={selected}
          tags={selectedTags}
          onConfirm={addTags}
          confirmButtonLoading={isAddingTagsToInstances}
          close={closeModal}
          profileChangesCount={profileChangesCount}
        />
      )}
    </>
  );
};

export default TagsAddForm;
