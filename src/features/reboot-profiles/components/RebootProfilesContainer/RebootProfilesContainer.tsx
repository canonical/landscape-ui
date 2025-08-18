import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import { type FC } from "react";
import { useGetRebootProfiles } from "../../api";
import RebootProfilesHeader from "../RebootProfilesHeader";
import RebootProfilesList from "../RebootProfilesList";

const RebootProfilesContainer: FC = () => {
  const { rebootProfiles, isPending: isLoading } = useGetRebootProfiles();
  const { search, setPageParams } = usePageParams();

  const handleAddProfile = () => {
    setPageParams({ sidePath: ["add"], rebootProfile: -1 });
  };

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading && rebootProfiles.length === 0 && !search && (
        <EmptyState
          title="You don't have any Reboot profiles yet"
          body={
            <>
              <p className="u-no-margin--bottom">
                Regular reboots keep your system healthy and secure by applying
                the latest updates. They also help maintain Livepatch coverage.
                Add a reboot profile to automate this process for your
                instances.
              </p>
              <a
                href="https://ubuntu.com/security/livepatch/docs"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                Learn more about Livepatch.
              </a>
            </>
          }
          cta={[
            <Button
              appearance="positive"
              key="table-add-new-profile"
              onClick={handleAddProfile}
              type="button"
            >
              Add reboot profile
            </Button>,
          ]}
        />
      )}
      {!isLoading && rebootProfiles.length > 0 && (
        <>
          <RebootProfilesHeader />
          <RebootProfilesList profiles={rebootProfiles} />
        </>
      )}
    </>
  );
};

export default RebootProfilesContainer;
