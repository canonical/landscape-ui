import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import LoadingState from "@/components/layout/LoadingState";
import ViewProfileGeneralBlock from "../../../profiles/components/ViewProfileSidePanel/components/ViewProfileGeneralBlock/ViewProfileGeneralBlock";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon, ICONS, ModularTable } from "@canonical/react-components";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import type { APTSource } from "@/features/apt-sources";
import type { FC } from "react";
import { Suspense, lazy, useMemo, useState } from "react";
import type { Column } from "react-table";
import { useBoolean } from "usehooks-ts";
import { useRepositoryProfiles } from "../../api";
import type { RepositoryProfile } from "../../types";
import Blocks from "@/components/layout/Blocks/Blocks";
import ViewProfileAssociationBlock from "../../../profiles/components/ViewProfileSidePanel/components/ViewProfileAssociationBlock/ViewProfileAssociationBlock";
import { ProfileTypes } from "@/features/profiles";

const RepositoryProfileForm = lazy(async () => import("../RepositoryProfileForm"));

interface RepositoryProfileDetailsProps {
  readonly profile: RepositoryProfile;
}

const SOURCES_PAGE_SIZE = 10;

const aptSourceColumns: Column<APTSource>[] = [
  {
    accessor: "name",
    Header: "Source",
  },
];

const RepositoryProfileDetails: FC<RepositoryProfileDetailsProps> = ({
  profile,
}) => {
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();

  const [sourcesPage, setSourcesPage] = useState(1);
  const totalSourcePages = Math.max(1, Math.ceil(profile.apt_sources.length / SOURCES_PAGE_SIZE));
  const safeSourcesPage = Math.min(sourcesPage, totalSourcePages);
  const pagedSources = useMemo(
    () => profile.apt_sources.slice((safeSourcesPage - 1) * SOURCES_PAGE_SIZE, safeSourcesPage * SOURCES_PAGE_SIZE),
    [profile.apt_sources, safeSourcesPage],
  );

  const { removeRepositoryProfileQuery } = useRepositoryProfiles();
  const { mutateAsync: removeRepositoryProfile, isPending: isRemoving } =
    removeRepositoryProfileQuery;

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const handleEditProfile = (): void => {
    setSidePanelContent(
      `Edit ${profile.title}`,
      <Suspense fallback={<LoadingState />}>
        <RepositoryProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const handleRemoveProfile = async (): Promise<void> => {
    try {
      await removeRepositoryProfile({ name: profile.name });

      notify.success({
        title: "Repository profile removed",
        message: `Repository profile "${profile.title}" removed successfully`,
      });

      closeSidePanel();
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <div className="p-segmented-control u-sv2">
        <div className="p-segmented-control__list">
          <Button
            type="button"
            className="p-segmented-control__button"
            onClick={handleEditProfile}
            hasIcon
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>

          <Button
            type="button"
            className="p-segmented-control__button"
            onClick={openModal}
            hasIcon
            aria-label={`Remove ${profile.title}`}
          >
            <Icon name={`${ICONS.delete}--negative`} />
            <span className="u-text--negative">Remove</span>
          </Button>
        </div>
      </div>
      <Blocks dense>
        <ViewProfileGeneralBlock profile={profile} type={ProfileTypes.repository} />
        <Blocks.Item title="Sources">
          <ModularTable
            columns={aptSourceColumns}
            data={pagedSources}
            emptyMsg="No sources have been added yet."
          />
          <ModalTablePagination
            current={safeSourcesPage}
            max={totalSourcePages}
            onPrev={() => { setSourcesPage(safeSourcesPage - 1); }}
            onNext={() => { setSourcesPage(safeSourcesPage + 1); }}
          />
        </Blocks.Item>
        </Blocks>

        <ViewProfileAssociationBlock profile={profile} type={ProfileTypes.repository} />

        <TextConfirmationModal
          isOpen={isModalOpen}
          confirmationText={`remove ${profile.title}`}
          title="Remove repository profile"
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemoving}
          confirmButtonLoading={isRemoving}
          onConfirm={handleRemoveProfile}
          close={closeModal}
        >
          <p>
            This will remove &quot;{profile.title}&quot; profile. This action is{" "}
            <b>irreversible</b>.
          </p>
        </TextConfirmationModal>
    </>
  );
};

export default RepositoryProfileDetails;
