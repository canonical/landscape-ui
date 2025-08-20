import usePageParams from "@/hooks/usePageParams";
import { useGetPackageProfile } from "../api";

const usePackageProfileSidePanel = () => {
  const { profile: packageProfileName } = usePageParams();

  const { packageProfile, packageProfileError } =
    useGetPackageProfile(packageProfileName);

  if (packageProfileError) {
    throw packageProfileError;
  }

  return { packageProfile };
};

export default usePackageProfileSidePanel;
