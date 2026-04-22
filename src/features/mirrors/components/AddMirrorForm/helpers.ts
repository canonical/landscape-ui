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
import { UBUNTU_ARCHIVE_HOST, UBUNTU_PRO_HOST } from "../../constants";

export function getStrippedUrl(url: string): string {
  return url.replace(/\/[^\\/@]*@/, "/");
}

export function getInitialSourceType({
  ubuntuArchiveInfo,
  ubuntuEsmInfo,
}: {
  ubuntuArchiveInfo: UbuntuArchiveInfo;
  ubuntuEsmInfo: UbuntuArchiveInfo[];
}) {
  if (ubuntuArchiveInfo.distributions.length) {
    return "ubuntu-archive";
  } else if (ubuntuEsmInfo.length) {
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

  const components: string[] = distribution.components
    .filter(({ preselected }) => preselected)
    .map((component) => component.slug);

  const architectures: string[] = distribution.architectures
    .filter(({ preselected }) => preselected)
    .map((architecture) => architecture.slug);

  return {
    name: "",
    distribution: distribution.slug,
    components,
    architectures,
    downloadUdebPackages: false,
    downloadSources: false,
    downloadInstallerFiles: false,
  };
}

export function getInitialUbuntuArchiveValues(
  ubuntuArchiveInfo: UbuntuArchiveInfo,
): UbuntuArchiveFormProps {
  return {
    ...getInitialBaseValues(ubuntuArchiveInfo.distributions),
    sourceType: "ubuntu-archive",
    sourceUrl: `http://${UBUNTU_ARCHIVE_HOST}/ubuntu/`,
  };
}

export function getInitialUbuntuSnapshotsValues(
  ubuntuArchiveInfo: UbuntuArchiveInfo,
): UbuntuSnapshotsFormProps {
  return {
    ...getInitialBaseValues(ubuntuArchiveInfo.distributions),
    sourceType: "ubuntu-snapshots",
    sourceUrl: `http://${UBUNTU_ARCHIVE_HOST}/ubuntu/`,
    snapshotDate: moment().format(INPUT_DATE_FORMAT),
  };
}

export const getInitialUbuntuProValues = (
  ubuntuEsmInfo: UbuntuArchiveInfo[],
): UbuntuProFormProps => {
  return {
    ...getInitialBaseValues(ubuntuEsmInfo[0]!.distributions),
    sourceType: "ubuntu-pro",
    token: "",
    sourceUrl: `https://${UBUNTU_PRO_HOST}/`,
    proService: ubuntuEsmInfo[0]!.mirror_type,
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
  ubuntuArchiveInfo: UbuntuArchiveInfo;
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
