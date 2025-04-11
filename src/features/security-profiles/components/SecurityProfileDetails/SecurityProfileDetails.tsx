import InfoItem from "@/components/layout/InfoItem";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  Col,
  ConfirmationButton,
  Icon,
  Row,
} from "@canonical/react-components";
import { type FC } from "react";
import { useArchiveSecurityProfile } from "../../api";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileActions } from "../../types/SecurityProfileActions";

interface SecurityProfileDetailsProps {
  readonly actions: SecurityProfileActions;
  readonly profile: SecurityProfile;
}

const SecurityProfileDetails: FC<SecurityProfileDetailsProps> = ({
  actions,
  profile,
}) => {
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const { archiveSecurityProfile, isArchivingSecurityProfile } =
    useArchiveSecurityProfile();

  const handleArchiveProfile = async () => {
    await archiveSecurityProfile({
      id: profile.id,
    });

    closeSidePanel();
    notify.success({
      title: `You have archived "${profile.name}" profile`,
      message:
        "It will no longer run, but past audit data and profile details will remain accessible for selected duration of the retention period. You can activate it anytime.",
    });
  };

  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            className="p-segmented-control__button"
            type="button"
            hasIcon
            onClick={actions.downloadAudit}
          >
            <Icon name="file-blank" />
            <span>Download audit</span>
          </Button>

          <Button
            className="p-segmented-control__button"
            type="button"
            hasIcon
            onClick={actions.edit}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>

          <Button className="p-segmented-control__button" type="button" hasIcon>
            <Icon name="play" />
            <span>Run</span>
          </Button>

          <Button
            className="p-segmented-control__button"
            type="button"
            hasIcon
            onClick={actions.duplicate}
          >
            <Icon name="canvas" />
            <span>Duplicate</span>
          </Button>

          <ConfirmationButton
            className="has-icon p-segmented-control__button"
            type="button"
            confirmationModalProps={{
              title: `Archive "${profile.name}" profile`,
              children: (
                <p>
                  You are about to archive the &quot;{profile.name}&quot;
                  profile. Archiving this Security profile will prevent it from
                  running. However, it will NOT delete past audit data or remove
                  the profile details. You can reactivate the profile later to
                  allow it to run again.
                </p>
              ),
              confirmButtonLabel: "Archive",
              confirmButtonAppearance: "negative",
              confirmButtonDisabled: isArchivingSecurityProfile,
              confirmButtonLoading: isArchivingSecurityProfile,
              onConfirm: handleArchiveProfile,
            }}
          >
            <Icon name="archive" />
            <span>Archive</span>
          </ConfirmationButton>
        </div>
      </div>

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="Name" value={profile.title} />
        </Col>

        <Col size={6}>
          <InfoItem label="Access group" value={profile.access_group} />
        </Col>
      </Row>

      <Row className="u-no-padding">
        <InfoItem label="Status" value={profile.status} />
      </Row>

      <hr />
      <h5>Security profile</h5>

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="Benchmark" value={profile.benchmark} />
        </Col>

        <Col size={6}>
          <InfoItem
            label="Tailoring file"
            value={
              profile.tailoring_file_uri ? (
                <>
                  PLACEHOLDER
                  <Button
                    className="u-no-margin--bottom"
                    type="button"
                    hasIcon
                    appearance="base"
                  >
                    <Icon name="begin-downloading" />
                  </Button>
                </>
              ) : (
                "N/A"
              )
            }
          />
        </Col>
      </Row>

      <Row className="u-no-padding">
        <InfoItem label="Status" value={profile.mode} />
      </Row>

      <hr />
      <h5>Schedule</h5>

      <Row className="u-no-padding">
        <InfoItem label="Profile schedule" value={profile.schedule} />
      </Row>

      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem
            label="Last run"
            value={profile.last_run_results.timestamp}
          />
        </Col>

        <Col size={6}>
          <InfoItem label="Next run" value={profile.next_run_time} />
        </Col>
      </Row>

      {profile.mode == "fix-restart-audit" && (
        <Row className="u-no-padding">
          <InfoItem label="Restart schedule" value="PLACEHOLDER" />
        </Row>
      )}

      <hr />
      <h5>Association</h5>

      <Row className="u-no-padding">
        <InfoItem
          label="Associated instances"
          value={
            <>
              <Button className="u-no-margin--bottom" appearance="link">
                <span>{profile.associated_instances} instances</span>
              </Button>
            </>
          }
        />
      </Row>

      <Row className="u-no-padding">
        <InfoItem label="Tags" value={profile.tags.join(", ") || "N/A"} />
      </Row>
    </>
  );
};

export default SecurityProfileDetails;
