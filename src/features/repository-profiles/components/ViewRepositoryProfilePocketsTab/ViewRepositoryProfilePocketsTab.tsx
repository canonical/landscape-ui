import type { FC } from "react";
import { getDistributions } from "../../helpers";
import type { RepositoryProfile } from "../../types";
import { Row, Col } from "@canonical/react-components";
import classes from "./ViewRepositoryProfilePocketsTab.module.scss";

interface ViewRepositoryProfilePocketsTabProps {
  readonly profile: RepositoryProfile;
}

const ViewRepositoryProfilePocketsTab: FC<
  ViewRepositoryProfilePocketsTabProps
> = ({ profile }) => {
  const distributions = getDistributions(profile.pockets);

  return (
    <>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col small={1} medium={2} size={3}>
          <p className="p-heading--5 p-text--small p-text--small-caps">
            Distribution
          </p>
        </Col>
        <Col small={1} medium={2} size={4}>
          <p className="p-heading--5 p-text--small p-text--small-caps">
            Series
          </p>
        </Col>
        <Col small={2} medium={2} size={5}>
          <p className="p-heading--5 p-text--small p-text--small-caps">
            Pocket
          </p>
        </Col>
      </Row>

      {!distributions.length ? (
        <p>No pockets found for this profile.</p>
      ) : (
        distributions.map(
          ({ name: distributionName, series }) => (
            <Row key={distributionName} className={classes.bordered}>
              <Col small={1} medium={2} size={3}>
                {distributionName}
              </Col>
              <Col small={3} medium={4} size={9}>
                  {series.map(({ name: seriesName, pockets }) => (
                    <Row key={seriesName} className={classes.bordered}>
                      <Col small={1} medium={2} size={4}>
                        {seriesName}
                      </Col>
                      <Col small={2} medium={2} size={5}>
                        {pockets.map(
                          ({ name: pocketName }) => (pocketName)
                        ).join(", ")}
                      </Col>
                    </Row>
                  ))}
              </Col>
            </Row>
          ),
        )
      )}
    </>
  );
};

export default ViewRepositoryProfilePocketsTab;
