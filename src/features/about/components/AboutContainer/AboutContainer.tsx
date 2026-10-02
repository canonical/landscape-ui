import FormSection from "@/components/form/FormSection";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import { APP_COMMIT, APP_VERSION } from "@/constants";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";
import { Link } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./AboutContainer.module.scss";

const AboutContainer: FC = () => {
  const { envLoading, packageVersion, revision } = useEnv();

  if (envLoading) {
    return <LoadingState />;
  }

  return (
    <div className={classes.aboutContainer}>
      <hr className="p-rule--muted" />
      <FormSection className={classes.aboutSection} title="UI version">
        <InfoGrid className={classes.versionGrid} dense>
          <InfoGrid.Item label="App version" value={APP_VERSION || "unknown"} />
          <InfoGrid.Item
            label="UI hash"
            value={APP_COMMIT ? APP_COMMIT.slice(0, 7) : "unknown"}
          />
        </InfoGrid>
      </FormSection>
      <FormSection className={classes.aboutSection} title="Server version">
        <InfoGrid className={classes.versionGrid} dense>
          <InfoGrid.Item
            label="Package version"
            value={packageVersion || "unknown"}
          />
          <InfoGrid.Item label="Revision" value={revision || "unknown"} />
        </InfoGrid>
      </FormSection>
      <FormSection className={classes.aboutSection} title="Useful Links">
        <ul className="p-list">
          <li>
            <Link
              className={classes.usefulLink}
              href={ROUTES.external.documentation()}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Landscape documentation
            </Link>
          </li>
          <li>
            <Link
              className={classes.usefulLink}
              href={ROUTES.external.support()}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Support portal
            </Link>
          </li>
        </ul>
      </FormSection>
      <FormSection className={classes.aboutSection} title="Copyright">
        <span>
          © 2026 Canonical Ltd.
          <br />
          Ubuntu, Landscape, and Canonical are registered trademarks of
          Canonical Ltd.
        </span>
      </FormSection>
    </div>
  );
};

export default AboutContainer;
