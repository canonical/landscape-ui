import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  ConfirmationButton,
  ConfirmationModal,
  ContextualMenu,
  MenuLink,
} from "@canonical/react-components";
import classNames from "classnames";
import { FC, lazy, Suspense, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useDistributions } from "../../hooks";
import { Distribution, SyncPocketRef } from "../../types";
import EmptyDistribution from "../EmptyDistribution/EmptyDistribution";
import SeriesCard from "../SeriesCard";
import classes from "./DistributionCard.module.scss";

const NewSeriesForm = lazy(() => import("../NewSeriesForm"));

interface DistributionCardProps {
  distribution: Distribution;
  syncPocketRefAdd: (ref: SyncPocketRef) => void;
  syncPocketRefs: SyncPocketRef[];
}

const DistributionCard: FC<DistributionCardProps> = ({
  distribution,
  syncPocketRefAdd,
  syncPocketRefs,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { setSidePanelContent } = useSidePanel();
  const isLargeScreen = useMediaQuery("(min-width: 620px)");
  const { removeDistributionQuery } = useDistributions();
  const debug = useDebug();

  const { mutateAsync: removeDistribution, isPending: isRemoving } =
    removeDistributionQuery;

  const handleRemoveDistribution = async () => {
    try {
      await removeDistribution({ name: distribution.name });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleAddSeries = () => {
    setSidePanelContent(
      `Add series to ${distribution.name}`,
      <Suspense fallback={<LoadingState />}>
        <NewSeriesForm distribution={distribution} ctaText="Add series" />
      </Suspense>,
    );
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const addSeriesButton = {
    label: "Add series",
    ariaLabel: `Add series to ${distribution.name}`,
    onClick: handleAddSeries,
  };

  const removeDistributionButton = {
    label: "Remove distribution",
    ariaLabel: `Remove ${distribution.name} distribution`,
    appearance: "negative",
    modalTitle: `Removing ${distribution.name} distribution`,
    modalBody: <p>Are you sure? This action cannot be undone.</p>,
    modalActionLabel: "Remove",
    isLoading: isRemoving,
    onClick: handleOpenModal,
    onConfirm: handleRemoveDistribution,
  };

  const largeScreenButtons = [
    <Button
      key={`${addSeriesButton.label}-button`}
      type="button"
      className="is-small"
      aria-label={addSeriesButton.ariaLabel}
      onClick={addSeriesButton.onClick}
    >
      {addSeriesButton.label}
    </Button>,
    <ConfirmationButton
      key={`${removeDistributionButton.label}-button`}
      type="button"
      className="is-small"
      aria-label={removeDistributionButton.ariaLabel}
      confirmationModalProps={{
        title: removeDistributionButton.modalTitle,
        children: removeDistributionButton.modalBody,
        confirmButtonLabel: removeDistributionButton.modalActionLabel,
        confirmButtonAppearance: removeDistributionButton.appearance,
        confirmButtonLoading: isRemoving,
        confirmButtonDisabled: isRemoving,
        onConfirm: removeDistributionButton.onConfirm,
      }}
    >
      {removeDistributionButton.label}
    </ConfirmationButton>,
  ];

  const contextualMenuLinks: MenuLink[] = [
    {
      children: addSeriesButton.label,
      "aria-label": addSeriesButton.ariaLabel,
      onClick: addSeriesButton.onClick,
    },
    {
      children: removeDistributionButton.label,
      "aria-label": removeDistributionButton.ariaLabel,
      onClick: removeDistributionButton.onClick,
    },
  ];

  return (
    <>
      <div className={classes.item}>
        <div className={classes.titleGroup}>
          <h2
            className={classNames(
              "p-heading--4 u-no-margin--bottom u-no-padding--top",
              classes.title,
            )}
          >
            {distribution.name}
          </h2>
          {isLargeScreen ? (
            <div>{largeScreenButtons}</div>
          ) : (
            <ContextualMenu
              position="left"
              hasToggleIcon
              toggleLabel="Actions"
              toggleProps={{
                "aria-label": `${distribution.name} distribution actions`,
              }}
              links={contextualMenuLinks}
            />
          )}
        </div>
        {0 === distribution.series.length && (
          <EmptyDistribution distribution={distribution} />
        )}
        {distribution.series.length > 0 &&
          distribution.series.map((series) => (
            <SeriesCard
              key={series.name}
              distribution={distribution}
              series={series}
              syncPocketRefAdd={syncPocketRefAdd}
              syncPocketRefs={syncPocketRefs}
            />
          ))}
      </div>
      {modalOpen && (
        <ConfirmationModal
          title={removeDistributionButton.modalTitle}
          confirmButtonLabel={removeDistributionButton.modalActionLabel}
          confirmButtonAppearance={removeDistributionButton.appearance}
          confirmButtonDisabled={removeDistributionButton.isLoading}
          confirmButtonLoading={removeDistributionButton.isLoading}
          onConfirm={removeDistributionButton.onConfirm}
          close={handleCloseModal}
        >
          {removeDistributionButton.modalBody}
        </ConfirmationModal>
      )}
    </>
  );
};

export default DistributionCard;
