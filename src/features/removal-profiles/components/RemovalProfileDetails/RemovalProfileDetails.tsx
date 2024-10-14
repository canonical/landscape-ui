import { FC, lazy, Suspense } from "react";
import {
  Button,
  Col,
  ConfirmationButton,
  Icon,
  ICONS,
  Row,
} from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { useRemovalProfiles } from "../../hooks";
import { RemovalProfile } from "../../types";
import classes from "./RemovalProfileDetails.module.scss";

const SingleRemovalProfileForm = lazy(
  () => import("../SingleRemovalProfileForm"),
);

interface RemovalProfileDetailsProps {
  accessGroupOptions: SelectOption[];
  profile: RemovalProfile;
}

const RemovalProfileDetails: FC<RemovalProfileDetailsProps> = ({
  accessGroupOptions,
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();
  const { removeRemovalProfileQuery } = useRemovalProfiles();

  const { mutateAsync: removeRemovalProfile, isPending: isRemoving } =
    removeRemovalProfileQuery;

  const handleRemoveRemovalProfile = async () => {
    try {
      await removeRemovalProfile({ name: profile.name });

      closeSidePanel();

      notify.success({
        title: "Removal profile removed",
        message: `Removal profile ${profile.name} has been removed`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleEditRemovalProfile = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleRemovalProfileForm action="edit" profile={profile} />
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
          onClick={handleEditRemovalProfile}
          aria-label={`Edit ${profile.title}`}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <ConfirmationButton
          className="p-segmented-control__button has-icon"
          type="button"
          confirmationModalProps={{
            title: "Remove removal profile",
            children: (
              <p>This will remove &quot;{profile.name}&quot; profile.</p>
            ),
            confirmButtonLabel: "Remove",
            confirmButtonAppearance: "negative",
            confirmButtonDisabled: isRemoving,
            confirmButtonLoading: isRemoving,
            onConfirm: handleRemoveRemovalProfile,
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
        <Col size={12}>
          <InfoItem
            label="Removal timeframe"
            value={`${profile.days_without_exchange} days`}
          />
        </Col>
      </Row>

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
      </div>
    </>
  );
};

export default RemovalProfileDetails;
