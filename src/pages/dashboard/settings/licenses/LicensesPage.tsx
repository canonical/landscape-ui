import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { LicensesList, useGetLicenses } from "@/features/licenses";
import { ROUTES } from "@/libs/routes";
import { Link as ExternalLink } from "@canonical/react-components";
import type { FC } from "react";
import { Link as Link } from "react-router";
import classes from "./LicensesPage.module.scss";

const LicensesPage: FC = () => {
  const { licenses, isGettingLicenses } = useGetLicenses();

  if (isGettingLicenses) {
    return <LoadingState />;
  }

  return (
    <PageMain>
      <PageHeader
        title="Licenses"
        subtitle={
          <div className={classes.subtitle}>
            <span>Keep track of your active licenses.</span>
            <Link to={ROUTES.instances.root({ query: "license-id:none" })}>
              View instances without a Landscape license.
            </Link>
          </div>
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
      <PageContent hasTable>
        {!licenses.length ? (
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
        )}
      </PageContent>
    </PageMain>
  );
};

export default LicensesPage;
