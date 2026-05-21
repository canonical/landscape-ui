import HeaderActions from "@/components/layout/HeaderActions";
import usePageParams from "@/hooks/usePageParams";
import useAuth from "@/hooks/useAuth";
import type { FC } from "react";
import React from "react";
import { useBoolean } from "usehooks-ts";
import DetachTokenModal from "../DetachTokenModal";
import { getComputerIdFromParams } from "../../helpers";
import { useParams } from "react-router";
import type { UrlParams } from "@/types/UrlParams";
import type { Instance } from "@/types/Instance";

interface UbuntuProHeaderProps {
  readonly instance: Instance;
}

const UbuntuProHeader: FC<UbuntuProHeaderProps> = ({ instance }) => {
  const { instanceId, childInstanceId } = useParams<UrlParams>();
  const { isFeatureEnabled } = useAuth();
  const { createSidePathPusher } = usePageParams();

  const {
    value: showDetachModal,
    setTrue: openDetachModal,
    setFalse: closeDetachModal,
  } = useBoolean(false);

  const handleEditToken = createSidePathPusher("replace-token");

  return (
    <>
      <HeaderActions
        title={
          <div>
            <span className="p-heading--5 u-no-margin--bottom">
              Account information
            </span>{" "}
            <span style={{ display: "inline" }}>
              <span className="u-text--muted">listed from </span>
              <a
                href="https://ubuntu.com/pro/dashboard"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                Ubuntu Pro Dashboard
              </a>
            </span>
          </div>
        }
        actions={{
          nondestructive: [
            { icon: "edit", label: "Edit token", onClick: handleEditToken },
          ],
          destructive: [
            {
              icon: "delete",
              label: "Detach token",
              onClick: openDetachModal,
              excluded: !isFeatureEnabled("ubuntu-pro-licensing"),
            },
          ],
        }}
      />
      <DetachTokenModal
        isOpen={showDetachModal}
        onClose={closeDetachModal}
        computerIds={getComputerIdFromParams({ instanceId, childInstanceId })}
        instanceTitle={instance.title}
      />
    </>
  );
};

export default UbuntuProHeader;
