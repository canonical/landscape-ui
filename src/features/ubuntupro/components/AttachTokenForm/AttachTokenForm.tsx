import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import TokenFormBase, { UBUNTU_PRO_DASHBOARD_URL } from "../TokenFormBase";
import { getAttachFormNotification } from "./helpers";
import { classifyInstancesByToken } from "../../helpers";

interface AttachTokenFormProps {
  readonly selectedInstances: Instance[];
}

const AttachTokenForm: FC<AttachTokenFormProps> = ({ selectedInstances }) => {
  const { withToken, withoutToken } =
    classifyInstancesByToken(selectedInstances);

  const hasMixedTokens = withToken > 0 && withoutToken > 0;

  const notification = getAttachFormNotification(
    withToken,
    withoutToken,
    selectedInstances.length,
    selectedInstances[0]?.title,
  );

  return (
    <TokenFormBase
      selectedInstances={selectedInstances}
      submitButtonText="Attach token"
      notification={notification}
    >
      <p>
        Attach a token from your{" "}
        <a
          href={UBUNTU_PRO_DASHBOARD_URL}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Ubuntu Pro dashboard
        </a>{" "}
        to enable Ubuntu Pro entitlements like security patching, ESM,
        compliance tools, and more on your selected instances.
      </p>
      {hasMixedTokens && (
        <p>
          You&apos;re attaching a token to {selectedInstances.length}{" "}
          {pluralize(selectedInstances.length, "instance")}. If they already
          have a token it will be overriden.
        </p>
      )}

      {hasMixedTokens && (
        <ul>
          <li>
            {withoutToken} {pluralize(withoutToken, "instance")} will be
            attached to this token
          </li>
          <li>
            {withToken} {pluralize(withToken, "instance")} will override{" "}
            {pluralize(withToken, "its", "their")} existing token.
          </li>
        </ul>
      )}
    </TokenFormBase>
  );
};

export default AttachTokenForm;
