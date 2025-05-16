import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import {
  CheckboxInput,
  ModularTable,
  SearchBox,
} from "@canonical/react-components";
import { type FC, useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useTaggedSecurityProfiles } from "../../hooks";
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
  const { mutateAsync: addTagsToInstances, isPending: isAddingTags } =
    addTagsToInstancesQuery;
  const { data: getAllInstanceTagsQueryResult, isLoading: isLoadingTags } =
    getAllInstanceTagsQuery();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { securityProfiles, isSecurityProfilesLoading } =
    useTaggedSecurityProfiles(tags, selected);

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
    if (securityProfiles.length) {
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
        submitButtonDisabled={
          !tags.length || isAddingTags || isSecurityProfilesLoading
        }
        submitButtonText="Assign"
      />

      {isModalVisible && (
        <TagsAddConfirmationModal
          instances={selected}
          securityProfiles={securityProfiles}
          tags={tags}
          onConfirm={addTags}
          confirmButtonDisabled={isAddingTags}
          close={closeModal}
        />
      )}
    </>
  );
};

export default TagsAddForm;
