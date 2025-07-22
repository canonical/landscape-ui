import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Col, Icon, ICONS, Row } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useRemoveRebootProfileQuery } from "../../api";
import type { RebootProfile } from "../../types";
import RebootProfileAssociatedInstancesLink from "../RebootProfileAssociatedInstancesLink";
import { formatWeeklyRebootSchedule } from "./helpers";
import classes from "./RebootProfileDetails.module.scss";

const RebootProfilesForm = lazy(async () => import("../RebootProfilesForm"));

interface RebootProfileDetailsProps {
  readonly accessGroupOptions: SelectOption[];
  readonly profile: RebootProfile;
}

const RebootProfileDetails: FC<RebootProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfileQuery();

  const handleRemoveRebootProfile = async () => {
    try {
      await removeRebootProfile({
        id: profile.id,
      });

      closeSidePanel();

      notify.success({
        title: "Reboot profile removed",
        message: `Reboot profile ${profile.title} has been removed`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleEditRebootProfile = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <RebootProfilesForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const handleDuplicateRebootProfile = () => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <RebootProfilesForm action="duplicate" profile={profile} />
      </Suspense>,
    );
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="p-segmented-control">
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handleEditRebootProfile}
          aria-label={`Edit reboot profile ${profile.title}`}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handleDuplicateRebootProfile}
          aria-label={`Edit reboot profile ${profile.title}`}
        >
          <Icon name="canvas" />
          <span>Duplicate</span>
        </Button>
        <Button
          className="p-segmented-control__button has-icon"
          type="button"
          hasIcon
          onClick={handleOpenModal}
          aria-label={`Remove reboot profile ${profile.title}`}
        >
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </Button>
      </div>

      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="Title" value={profile.title} />
        </Col>
        <Col size={6}>
          <InfoItem
            label="Access group"
            value={
              accessGroupOptions.find(
                ({ value }) => value === profile.access_group,
              )?.label ?? profile.access_group
            }
          />
        </Col>
      </Row>

      <div className={classes.block}>
        <p className="p-heading--5">Reboot schedule</p>
        <div>
          <InfoItem
            label="schedule"
            value={formatWeeklyRebootSchedule(profile)}
          />
        </div>
        <div>
          <InfoItem
            label="next reboot"
            value={moment(profile.next_run).format(DISPLAY_DATE_TIME_FORMAT)}
          />
        </div>
      </div>

      <div className={classes.block}>
        <p className="p-heading--5">Association</p>
        {profile.all_computers && (
          <p>This profile has been associated with all instances.</p>
        )}
        {!profile.all_computers && !profile.tags.length && (
          <p>This profile has not yet been associated with any instances.</p>
        )}
        {!profile.all_computers && profile.tags.length > 0 && (
          <>
            <InfoItem label="Tags" value={profile.tags.join(", ")} />
            <InfoItem
              label="associated instances"
              value={
                <RebootProfileAssociatedInstancesLink rebootProfile={profile} />
              }
            />
          </>
        )}
      </div>

      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove reboot profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        onConfirm={handleRemoveRebootProfile}
        confirmButtonDisabled={isRemovingRebootProfile}
        confirmButtonLoading={isRemovingRebootProfile}
        close={handleCloseModal}
        confirmationText={`remove ${profile.title}`}
      >
        <p>
          Are you sure you want to remove &quot;{profile.title}
          &quot; reboot profile? The removal of &quot;{profile.title}
          &quot; reboot profile is irreversible and might adversely affect your
          system.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default RebootProfileDetails;
