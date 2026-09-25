import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { LicensesList, useGetLicenses } from "@/features/licenses";
import { ROUTES } from "@/libs/routes";
import { Link as ExternalLink } from "@canonical/react-components";
import type { FC } from "react";
import { Link } from "react-router";

const LicensesPage: FC = () => {
  const { licenses, isGettingLicenses } = useGetLicenses();

  const content = !licenses.length ? (
    <EmptyState
      title="No licenses found"
      icon="connected"
      body="Your organization has no licenses."
      link={{
        href: "https://ubuntu.com/pro",
        text: "Add license",
      }}
    />
  ) : (
    <LicensesList licenses={licenses} />
  );

  return (
    <PageMain>
      <PageHeader
        title="Licenses"
        subtitle={
          <span>
            Keep track of your active licenses.{" "}
            <Link to={ROUTES.instances.root({ query: "license-id:none" })}>
              View instances without a Landscape license.
            </Link>
          </span>
        }
        actions={
          licenses.length
            ? [
                <ExternalLink
                  key="add-license"
                  href="https://ubuntu.com/pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-button--positive u-no-margin--bottom"
                >
                  Add license
                </ExternalLink>,
              ]
            : undefined
        }
      />
      {isGettingLicenses ? (
        <LoadingState />
      ) : (
        <PageContent hasTable>{content}</PageContent>
      )}
    </PageMain>
  );
};

export default LicensesPage;
