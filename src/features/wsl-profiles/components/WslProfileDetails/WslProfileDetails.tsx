import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Col, Icon, ICONS, Row } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import type { WslProfile } from "../../types";
import WslProfileAssociatedParentsLink from "../WslProfileAssociatedParentsLink";
import WslProfileCompliantParentsLink from "../WslProfileCompliantParentsLink";
import WslProfileNonCompliantParentsLink from "../WslProfileNonCompliantParentsLink";
import WslProfileRemoveModal from "../WslProfileRemoveModal";
import classes from "./WslProfileDetails.module.scss";

const WslProfileEditForm = lazy(async () => import("../WslProfileEditForm"));
const WslProfileInstallForm = lazy(
  async () => import("../WslProfileInstallForm"),
);

interface WslProfileDetailsProps {
  readonly profile: WslProfile;
  readonly accessGroupOptions: SelectOption[];
}

const WslProfileDetails: FC<WslProfileDetailsProps> = ({
  profile,
  accessGroupOptions,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleWslProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handleWslProfileDuplicate = () => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileInstallForm action="duplicate" profile={profile} />
      </Suspense>,
    );
  };

  return (
    <>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={handleWslProfileEdit}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>

          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={handleWslProfileDuplicate}
          >
            <Icon name="canvas" />
            <span>Duplicate</span>
          </Button>

          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            aria-label={`Remove ${profile.title} profile`}
            onClick={openRemoveModal}
          >
            <Icon name={ICONS.delete} />
            <span>Remove</span>
          </Button>
        </div>
      </div>

      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="Title" value={profile.title} />
        </Col>

        <Col size={6}>
          <InfoItem label="Name" value={profile.name} />
        </Col>
      </Row>

      <Row className="u-no-padding--left u-no-padding--right">
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

      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={12}>
          <InfoItem label="Description" value={profile.description} />
        </Col>
      </Row>

      <div className={classes.block}>
        <Row className="u-no-padding--left u-no-padding--right">
          <Col size={12}>
            <InfoItem label="RootFS image name" value={profile.image_name} />
          </Col>
        </Row>

        {profile.image_source && (
          <Row className="u-no-padding--left u-no-padding--right">
            <Col size={12}>
              <InfoItem
                type="truncated"
                label="RootFS image source"
                value={profile.image_source}
              />
            </Col>
          </Row>
        )}

        <Row className="u-no-padding--left u-no-padding--right">
          <Col size={12}>
            <InfoItem
              label="Cloud-init"
              value={profile.cloud_init_contents || <NoData />}
            />
          </Col>
        </Row>
      </div>

      <div className={classes.block}>
        <p className="p-heading--5">Association</p>

        {profile.all_computers ? (
          <p>This profile has been associated with all instances.</p>
        ) : (
          <Row className="u-no-padding--left u-no-padding--right">
            <Col size={12}>
              <InfoItem
                label="Tags"
                type="truncated"
                value={profile.tags.join(", ")}
              />
            </Col>
          </Row>
        )}

        {(profile.all_computers || !!profile.tags.length) && (
          <>
            <Row className="u-no-padding--left u-no-padding--right">
              <Col size={12}>
                <InfoItem
                  label="Associated parents"
                  value={
                    <WslProfileAssociatedParentsLink wslProfile={profile} />
                  }
                />
              </Col>
            </Row>

            <Row className="u-no-padding--left u-no-padding--right">
              <Col size={6}>
                <InfoItem
                  label="Not compliant"
                  value={
                    <WslProfileNonCompliantParentsLink wslProfile={profile} />
                  }
                />
              </Col>

              <Col size={6}>
                <InfoItem
                  label="Compliant"
                  value={
                    <WslProfileCompliantParentsLink wslProfile={profile} />
                  }
                />
              </Col>
            </Row>
          </>
        )}
      </div>

      <WslProfileRemoveModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        wslProfile={profile}
      />
    </>
  );
};

export default WslProfileDetails;
