import type { FormProps } from "./types";
import { SOURCE_TYPE_LOCAL_REPOSITORY } from "./constants";
import { getInstallsAndUpgradesValues } from "../../helpers";

export const getPublicationPayload = (values: FormProps) => {
  const publicationId = values.name.trim() || undefined;
  const architectures =
    values.sourceType === SOURCE_TYPE_LOCAL_REPOSITORY
      ? []
      : values.architectures;
  const { notAutomatic, butAutomaticUpgrades } = getInstallsAndUpgradesValues(
    values.installsAndUpgrades,
  );

  return {
    publicationId,
    body: {
      displayName: values.name.trim(),
      publicationTarget: values.publicationTarget,
      source: values.source,
      distribution: values.distribution.trim() || undefined,
      architectures: architectures.length > 0 ? architectures : undefined,
      acquireByHash: values.hashIndexing,
      notAutomatic,
      butAutomaticUpgrades,
      skipBz2: values.skipBz2,
      skipContents: values.skipContentIndexing,
      gpgKey: values.signingKey.trim()
        ? { armor: values.signingKey.trim() }
        : undefined,
    },
  };
};
