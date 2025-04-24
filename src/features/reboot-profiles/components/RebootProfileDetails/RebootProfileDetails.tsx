import type { ChangeEvent, FC } from "react";
import { lazy, Suspense, useState } from "react";
import {
  Button,
  Col,
  ConfirmationButton,
  Icon,
  ICONS,
  Input,
  Row,
} from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import type { RebootProfile } from "../../types";
import classes from "./RebootProfileDetails.module.scss";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { formatWeeklyRebootSchedule } from "./helpers";
import { useRemoveRebootProfileQuery } from "../../api";

const RebootProfilesForm = lazy(async () => import("../RebootProfilesForm"));

interface RebootProfileDetailsProps {
  readonly accessGroupOptions: SelectOption[];
  readonly profile: RebootProfile;
}

const RebootProfileDetails: FC<RebootProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfileQuery();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmDeleteProfileText(event.target.value);
  };

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
        <ConfirmationButton
          key={profile.id}
          className="p-segmented-control__button has-icon"
          confirmationModalProps={{
            title: "Remove reboot profile",
            children: (
              <>
                <div>
                  <p>
                    Are you sure you want to remove &quot;{profile.title}
                    &quot; reboot profile? The removal of &quot;{profile.title}
                    &quot; reboot profile is irreversible and might adversely
                    affect your system.
                  </p>
                  Type <strong>remove {profile.title}</strong> to confirm.
                </div>
                <Input
                  type="text"
                  value={confirmDeleteProfileText}
                  onChange={handleChange}
                />
              </>
            ),
            confirmButtonLabel: "Remove",
            confirmButtonAppearance: "negative",
            onConfirm: handleRemoveRebootProfile,
            confirmButtonDisabled:
              confirmDeleteProfileText !== `remove ${profile.title}` ||
              isRemovingRebootProfile,
            confirmButtonLoading: isRemovingRebootProfile,
          }}
        >
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </ConfirmationButton>
      </div>

      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="Name" value={profile.title} />
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
          <InfoItem
            label="Tags"
            value={profile.tags.length ? profile.tags.join(", ") : <NoData />}
          />
        )}
        {!profile.all_computers && profile.tags.length > 0 && (
          <InfoItem label="associated instances" value={profile.tags} />
        )}
      </div>
    </>
  );
};

export default RebootProfileDetails;
