import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import {
  Button,
  ConfirmationButton,
  ConfirmationModal,
  ContextualMenu,
} from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { DEFAULT_SNAPSHOT_URI } from "../../constants";
import { useSeries } from "../../hooks";
import type { Distribution, Pocket, Series, SyncPocketRef } from "../../types";
import SeriesPocketList from "../SeriesPocketList";
import classes from "./SeriesCard.module.scss";

const NewPocketForm = lazy(() => import("../NewPocketForm"));

const DeriveSeriesForm = lazy(() => import("../DeriveSeriesForm"));

interface SeriesCardProps {
  readonly distribution: Distribution;
  readonly series: Series;
  readonly syncPocketRefAdd: (ref: SyncPocketRef) => void;
  readonly syncPocketRefs: SyncPocketRef[];
}

const SeriesCard: FC<SeriesCardProps> = ({
  distribution,
  series,
  syncPocketRefAdd,
  syncPocketRefs,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [snapshotDate, setSnapshotDate] = useState("");

  const setFirstPocketDate = ([pocket]: Pocket[]): void => {
    if (
      !pocket ||
      pocket.mode !== "mirror" ||
      pocket.mirror_uri.startsWith(DEFAULT_SNAPSHOT_URI)
    ) {
      return;
    }

    setSnapshotDate(pocket.mirror_uri.replace(/^.*\/(\d{8})T\d{6}Z$/, "$1"));
  };

  useEffect(() => {
    setFirstPocketDate(series.pockets);
  }, [series]);

  const isLargeScreen = useMediaQuery("(min-width: 620px)");
  const { setSidePanelContent } = useSidePanel();
  const { removeSeriesQuery } = useSeries();
  const debug = useDebug();

  const { mutateAsync: removeSeries, isPending: isRemoving } =
    removeSeriesQuery;

  const handleRemoveSeries = async (): Promise<void> => {
    try {
      await removeSeries({
        name: series.name,
        distribution: distribution.name,
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  const handleOpenModal = (): void => {
    setModalOpen(true);
  };

  const handleDeriveSeries = (): void => {
    setSidePanelContent(
      "Derive series",
      <Suspense fallback={<LoadingState />}>
        <DeriveSeriesForm distribution={distribution} origin={series.name} />
      </Suspense>,
    );
  };

  const handleAddPocket = (): void => {
    setSidePanelContent(
      `New pocket for ${series.name}`,
      <Suspense fallback={<LoadingState />}>
        <NewPocketForm distribution={distribution} series={series} />
      </Suspense>,
    );
  };

  const actionButtons = [
    {
      label: "Derive series",
      ariaLabel: `Derive series ${distribution.name}/${series.name}`,
      onClick: handleDeriveSeries,
    },
    {
      label: "New pocket",
      ariaLabel: `Add new pocket for ${distribution.name}/${series.name}`,
      onClick: handleAddPocket,
    },
  ];

  const modalButton = {
    label: "Remove",
    ariaLabel: `Remove ${distribution.name}/${series.name}`,
    appearance: "negative",
    modalTitle: "Remove series",
    modalBody: <p>Are you sure? This action cannot be undone.</p>,
    isLoading: isRemoving,
    onClick: handleOpenModal,
    onConfirm: handleRemoveSeries,
  };

  const buttons = [...actionButtons, modalButton];

  const largeScreenActionButtons = actionButtons.map((item) => (
    <Button
      key={`${item.label}-button`}
      type="button"
      className="is-small"
      aria-label={item.ariaLabel}
      onMouseDown={(event) => event.preventDefault()}
      onClick={item.onClick}
    >
      {item.label}
    </Button>
  ));

  const largeScreenButtons = [
    ...largeScreenActionButtons,
    <ConfirmationButton
      key={`${modalButton.label}-button`}
      type="button"
      className="is-small"
      aria-label={modalButton.ariaLabel}
      confirmationModalProps={{
        title: modalButton.modalTitle,
        children: modalButton.modalBody,
        confirmButtonLabel: modalButton.label,
        confirmButtonAppearance: modalButton.appearance,
        confirmButtonLoading: modalButton.isLoading,
        confirmButtonDisabled: modalButton.isLoading,
        onConfirm: modalButton.onConfirm,
      }}
    >
      {modalButton.label}
    </ConfirmationButton>,
  ];

  const contextualMenuLinks: MenuLink[] = buttons
    .map((item) => ({
      children: item.label,
      "aria-label": item.ariaLabel,
      onClick: item.onClick,
    }))
    .filter(
      (link) =>
        !(
          snapshotDate &&
          (link.children === "Derive series" || link.children === "New pocket")
        ),
    );

  return (
    <>
      <div className={classes.card}>
        <div className={classes.header}>
          <h3 className={classes.title}>{series.name}</h3>
          {!!snapshotDate && (
            <span
              className={classNames("u-text--muted", classes.snapshot)}
            >{`Snapshot from ${moment(snapshotDate).format(
              DISPLAY_DATE_FORMAT,
            )}`}</span>
          )}
          {isLargeScreen ? (
            <div className={classes.cta}>{largeScreenButtons}</div>
          ) : (
            <ContextualMenu
              position="left"
              hasToggleIcon
              toggleLabel="Actions"
              toggleClassName="u-no-margin--bottom"
              links={contextualMenuLinks}
            />
          )}
        </div>
        <div className={classes.content}>
          <SeriesPocketList
            distributionName={distribution.name}
            series={series}
            syncPocketRefAdd={syncPocketRefAdd}
            syncPocketRefs={syncPocketRefs}
          />
        </div>
      </div>
      {modalOpen && (
        <ConfirmationModal
          title={modalButton.modalTitle}
          confirmButtonLabel={modalButton.label}
          close={handleCloseModal}
          confirmButtonAppearance={modalButton.appearance}
          confirmButtonLoading={modalButton.isLoading}
          confirmButtonDisabled={modalButton.isLoading}
          onConfirm={modalButton.onConfirm}
        >
          {modalButton.modalBody}
        </ConfirmationModal>
      )}
    </>
  );
};

export default SeriesCard;
