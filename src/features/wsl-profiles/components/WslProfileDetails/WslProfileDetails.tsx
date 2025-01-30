import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import type { WslProfile } from "../../types";
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
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import classes from "./WslProfileDetails.module.scss";
import useNotify from "@/hooks/useNotify";
import NoData from "@/components/layout/NoData";
import type { SelectOption } from "@/types/SelectOption";
import { useWslProfiles } from "../../hooks";

const WslProfileEditForm = lazy(() => import("../WslProfileEditForm"));
const WslProfileInstallForm = lazy(() => import("../WslProfileInstallForm"));

interface WslProfileDetailsProps {
  readonly profile: WslProfile;
  readonly accessGroupOptions: SelectOption[];
}

const WslProfileDetails: FC<WslProfileDetailsProps> = ({
  profile,
  accessGroupOptions,
}) => {
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeWslProfileQuery } = useWslProfiles();
  const { mutateAsync: removeWslProfile, isPending: isRemoving } =
    removeWslProfileQuery;

  const handleRemoveWslProfile = async (name: string) => {
    try {
      await removeWslProfile({ name });

      closeSidePanel();

      notify.success({
        message: `WSL profile "${name}" removed successfully.`,
        title: "WSL profile removed",
      });
    } catch (error) {
      debug(error);
    }
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDeleteProfileText(e.target.value);
  };

  return (
    <>
      <div className="p-segmented-control">
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
        <ConfirmationButton
          type="button"
          className="p-segmented-control__button has-icon"
          confirmationModalProps={{
            title: "Remove WSL profile",
            children: (
              <>
                <p>
                  Removing this profile will affect{" "}
                  <b>{profile.computers.constrained.length} instances</b>. This
                  action is irreversible.
                </p>
                <div>
                  Type <b>remove {profile.name}</b> to confirm.
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
            confirmButtonDisabled:
              isRemoving ||
              confirmDeleteProfileText !== `remove ${profile.name}`,
            confirmButtonLoading: isRemoving,
            onConfirm: () => handleRemoveWslProfile(profile.name),
          }}
        >
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </ConfirmationButton>
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="name" value={profile.title} />
        </Col>
        <Col size={6}>
          <InfoItem
            label="access group"
            value={
              accessGroupOptions.find(
                ({ value }) => value === profile.access_group,
              )?.label ?? profile.access_group
            }
          />
        </Col>
        <InfoItem label="description" value={profile.description} />
        <div className={classes.block}>
          <InfoItem label="rootfs image name" value={profile.image_name} />
          {profile.image_source && (
            <InfoItem
              type="truncated"
              label="rootfs image source"
              value={profile.image_source}
            />
          )}
          <InfoItem
            label="cloud init"
            value={profile.cloud_init_contents || "N/A"}
          />
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
              label="tags"
              value={profile.tags.length ? profile.tags.join(", ") : <NoData />}
            />
          )}
        </div>

        <Col size={12}>
          <InfoItem
            label="associated"
            value={`${profile.computers.constrained.length} instances`}
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="not compliant"
            value={`${profile.computers["non-compliant"].length} instances`}
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="pending"
            value={`${profile.computers.pending?.length ?? 0} instances`}
          />
        </Col>
      </Row>
    </>
  );
};

export default WslProfileDetails;
