import { INPUT_DATE_FORMAT } from "@/constants";
import moment from "moment";
import type {
  BaseFormProps,
  FormProps,
  ThirdPartyFormProps,
  UbuntuArchiveFormProps,
  UbuntuProFormProps,
  UbuntuSnapshotsFormProps,
} from "./types";
import type {
  Architecture,
  Component,
  Distribution,
  UbuntuArchiveInfo,
} from "../../types";
import {
  UBUNTU_ARCHIVE_HOST,
  UBUNTU_PRO_HOST,
  UBUNTU_SNAPSHOTS_HOST,
} from "../../constants";
import { hasOneItem } from "@/utils/_helpers";
import { isArchiveInfoValid } from "../../helpers";

export function getStrippedUrl(url: string): string {
  return url.replace(/\/[^\\/@]*@/, "/");
}

export function getInitialSourceType({
  ubuntuArchiveInfo,
  ubuntuEsmInfo,
}: {
  ubuntuArchiveInfo: UbuntuArchiveInfo | undefined;
  ubuntuEsmInfo: UbuntuArchiveInfo[];
}) {
  // While archive info is still loading, default to "ubuntu-archive" — it's
  // the most common case and the data-dependent fields stay disabled with a
  // loading note until the response arrives.
  if (!ubuntuArchiveInfo || isArchiveInfoValid(ubuntuArchiveInfo)) {
    return "ubuntu-archive";
  } else if (ubuntuEsmInfo.some(isArchiveInfoValid)) {
    return "ubuntu-pro";
  } else {
    return "third-party";
  }
}

export function getInitialDistribution(
  distributions: Distribution[],
): Distribution {
  const preselectedDistribution = distributions.find(
    ({ preselected }: Component | Architecture) => preselected,
  );

  const [firstDistribution] = distributions;

  const emptyDistribution = {
    architectures: [],
    components: [],
    label: "",
    slug: "",
    preselected: false,
  };

  return preselectedDistribution ?? firstDistribution ?? emptyDistribution;
}

export function getInitialBaseValues(
  distributions: Distribution[],
): Omit<BaseFormProps, "sourceType" | "sourceUrl"> {
  const distribution: Distribution = getInitialDistribution(distributions);

  const preselectedComponents = hasOneItem(distribution.components)
    ? distribution.components
    : distribution.components.filter(({ preselected }) => preselected);

  const components: string[] = preselectedComponents.map(
    (component) => component.slug,
  );

  const preselectedArchitectures = hasOneItem(distribution.architectures)
    ? distribution.architectures
    : distribution.architectures.filter(({ preselected }) => preselected);

  const architectures: string[] = preselectedArchitectures.map(
    (architecture) => architecture.slug,
  );

  return {
    name: "",
    distribution: distribution.slug,
    components,
    architectures,
    preserveSignatures: false,
    downloadUdebPackages: false,
    downloadSources: false,
    downloadInstallerFiles: false,
  };
}

export function getInitialUbuntuArchiveValues(
  ubuntuArchiveInfo: UbuntuArchiveInfo | undefined,
): UbuntuArchiveFormProps {
  return {
    ...getInitialBaseValues(ubuntuArchiveInfo?.distributions ?? []),
    sourceType: "ubuntu-archive",
    sourceUrl: `https://${UBUNTU_ARCHIVE_HOST}/ubuntu/`,
  };
}

export function getInitialUbuntuSnapshotsValues(
  ubuntuArchiveInfo: UbuntuArchiveInfo | undefined,
): UbuntuSnapshotsFormProps {
  return {
    ...getInitialBaseValues(ubuntuArchiveInfo?.distributions ?? []),
    sourceType: "ubuntu-snapshots",
    sourceUrl: `https://${UBUNTU_SNAPSHOTS_HOST}/ubuntu/`,
    snapshotDate: moment().format(INPUT_DATE_FORMAT),
  };
}

export const getInitialUbuntuProValues = (
  ubuntuEsmInfo: UbuntuArchiveInfo[],
): UbuntuProFormProps => {
  const [firstValidProService] = ubuntuEsmInfo.filter(isArchiveInfoValid);
  return {
    ...getInitialBaseValues(
      firstValidProService ? firstValidProService.distributions : [],
    ),
    sourceType: "ubuntu-pro",
    token: "",
    sourceUrl: `https://${UBUNTU_PRO_HOST}/`,
    proService: firstValidProService ? firstValidProService.mirror_type : "",
  };
};

export const getInitialThirdPartyValues = (): ThirdPartyFormProps => {
  return {
    ...getInitialBaseValues([]),
    sourceType: "third-party",
    sourceUrl: "",
    verificationGpgKey: "",
  };
};

export const getInitialValues = ({
  sourceType,
  ubuntuArchiveInfo,
  ubuntuEsmInfo,
}: {
  sourceType?: FormProps["sourceType"];
  ubuntuArchiveInfo: UbuntuArchiveInfo | undefined;
  ubuntuEsmInfo: UbuntuArchiveInfo[];
}): FormProps => {
  sourceType ??= getInitialSourceType({
    ubuntuArchiveInfo,
    ubuntuEsmInfo,
  });

  switch (sourceType) {
    case "ubuntu-archive":
      return getInitialUbuntuArchiveValues(ubuntuArchiveInfo);
    case "ubuntu-snapshots":
      return getInitialUbuntuSnapshotsValues(ubuntuArchiveInfo);
    case "ubuntu-pro":
      return getInitialUbuntuProValues(ubuntuEsmInfo);
    case "third-party":
      return getInitialThirdPartyValues();
  }
};
