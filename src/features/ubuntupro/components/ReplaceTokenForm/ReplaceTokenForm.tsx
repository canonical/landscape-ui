import type { Instance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";
import TokenFormBase, { UBUNTU_PRO_DASHBOARD_URL } from "../TokenFormBase";
import { getReplaceFormNotification } from "./helpers";

interface ReplaceTokenFormProps {
  readonly selectedInstances: Instance[];
}

const ReplaceTokenForm: FC<ReplaceTokenFormProps> = ({ selectedInstances }) => {
  const notification = getReplaceFormNotification(
    selectedInstances.length,
    selectedInstances[0]?.title,
  );

  return (
    <TokenFormBase
      selectedInstances={selectedInstances}
      submitButtonText="Replace"
      notification={notification}
    >
      <p>
        Replacing a token will override your{" "}
        {pluralize(selectedInstances.length, "instance's", "instances'")}{" "}
        existing token. You can find your tokens on the{" "}
        <a
          href={UBUNTU_PRO_DASHBOARD_URL}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Ubuntu Pro dashboard
        </a>
      </p>
    </TokenFormBase>
  );
};

export default ReplaceTokenForm;
