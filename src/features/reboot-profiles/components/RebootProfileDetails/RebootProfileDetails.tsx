import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import Blocks from "@/components/layout/Blocks";
import LoadingState from "@/components/layout/LoadingState";
import Menu from "@/components/layout/Menu";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Icon, ICONS } from "@canonical/react-components";
import moment from "moment";
import type { ComponentProps, FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useRemoveRebootProfileQuery } from "../../api";
import type { RebootProfile } from "../../types";
import RebootProfileAssociatedInstancesLink from "../RebootProfileAssociatedInstancesLink";
import { formatWeeklyRebootSchedule } from "./helpers";

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

  const associationMenuItems: ComponentProps<typeof Menu>["items"] = [];

  if (!profile.all_computers) {
    associationMenuItems.push({
      label: "Tags",
      size: 12,
      value: profile.tags.join(", ") || <NoData />,
      type: "truncated",
    });
  }

  if (profile.all_computers || profile.tags.length) {
    associationMenuItems.push({
      label: "Associated instances",
      size: 12,
      value: <RebootProfileAssociatedInstancesLink rebootProfile={profile} />,
    });
  }

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

      <Blocks>
        {{
          content: (
            <Menu
              items={[
                { label: "Title", size: 6, value: profile.title },
                {
                  label: "Access group",
                  size: 6,
                  value:
                    accessGroupOptions.find(
                      ({ value }) => value === profile.access_group,
                    )?.label ?? profile.access_group,
                },
              ]}
            />
          ),
        }}

        {{
          title: "Reboot schedule",
          content: (
            <Menu
              items={[
                {
                  label: "Schedule",
                  size: 12,
                  value: formatWeeklyRebootSchedule(profile),
                },
                {
                  label: "Next reboot",
                  size: 12,
                  value: moment(profile.next_run).format(
                    DISPLAY_DATE_TIME_FORMAT,
                  ),
                },
              ]}
            />
          ),
        }}
        {{
          title: "Association",
          content: (
            <>
              {profile.all_computers && (
                <p>This profile has been associated with all instances.</p>
              )}

              <Menu items={associationMenuItems} />
            </>
          ),
        }}
      </Blocks>

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
