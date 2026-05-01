import ListActions from "@/components/layout/ListActions";
import { useIsUsgProfilesLimitReached } from "@/features/usg-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import { type FC } from "react";
import { useNavigate } from "react-router";
import { useBoolean } from "usehooks-ts";
import { useRunUsgProfile } from "../../api";
import { getNotificationMessage } from "../../helpers";
import type { USGProfile } from "../../types";
import USGProfileArchiveModal from "../USGProfileArchiveModal";
import { ROUTES } from "@/libs/routes";

interface USGProfileListActionsProps {
  readonly profile: USGProfile;
}

const USGProfileListActions: FC<USGProfileListActionsProps> = ({ profile }) => {
  const debug = useDebug();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const { setPageParams, createPageParamsSetter } = usePageParams();

  const profileLimitReached = useIsUsgProfilesLimitReached();
  const { runUsgProfile } = useRunUsgProfile();

  const {
    value: archiveModalOpened,
    setTrue: openArchiveModal,
    setFalse: closeArchiveModal,
  } = useBoolean();

  const handleRunUsgProfile = async () => {
    try {
      const { data: activity } = await runUsgProfile({ id: profile.id });

      setPageParams({ sidePath: [], name: "" });

      const message = getNotificationMessage(profile.mode);

      notify.success({
        title: `You have successfully initiated run of the ${profile.title} USG profile`,
        message,
        actions: [
          {
            label: "View details",
            onClick: () => {
              navigate(
                ROUTES.activities.root({
                  query: `parent-id:${activity.id}`,
                }),
              );
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  const nondestructiveActions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View "${profile.title}" USG profile details`,
      onClick: createPageParamsSetter({
        sidePath: ["view"],
        name: profile.id.toString(),
      }),
    },
    {
      icon: "file-blank",
      label: "Download audit",
      "aria-label": `Download "${profile.title}" USG profile audit`,
      onClick: createPageParamsSetter({
        sidePath: ["download"],
        name: profile.id.toString(),
      }),
    },
  ];

  if (profile.status !== "archived") {
    nondestructiveActions.push(
      {
        icon: "edit",
        label: "Edit",
        "aria-label": `Edit "${profile.title}" USG profile`,
        onClick: createPageParamsSetter({
          sidePath: ["edit"],
          name: profile.id.toString(),
        }),
      },
      {
        icon: "play",
        label: "Run",
        "aria-label": `Run "${profile.title}" USG profile`,
        onClick: async () => {
          if (!profile.mode.includes("fix")) {
            await handleRunUsgProfile();
            return;
          }

          setPageParams({ sidePath: ["run"], name: profile.id.toString() });
        },
        disabled: !profile.associated_instances,
      },
    );
  }

  nondestructiveActions.push({
    icon: "canvas",
    label: "Duplicate profile",
    "aria-label": `Duplicate "${profile.title}" USG profile`,
    onClick: createPageParamsSetter({
      sidePath: ["duplicate"],
      name: profile.id.toString(),
    }),
    disabled: profileLimitReached,
  });

  const destructiveActions: Action[] | undefined =
    profile.status !== "archived"
      ? [
          {
            icon: "archive",
            label: "Archive",
            "aria-label": `Archive "${profile.title}" USG profile`,
            onClick: openArchiveModal,
          },
        ]
      : undefined;

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={nondestructiveActions}
        destructiveActions={destructiveActions}
      />

      <USGProfileArchiveModal
        close={closeArchiveModal}
        opened={archiveModalOpened}
        profile={profile}
      />
    </>
  );
};

export default USGProfileListActions;
