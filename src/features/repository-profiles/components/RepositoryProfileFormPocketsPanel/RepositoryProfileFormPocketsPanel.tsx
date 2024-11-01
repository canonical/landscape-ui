import classNames from "classnames";
import { FormikContextType } from "formik";
import { FC, useState } from "react";
import { CheckboxInput, Col, Row } from "@canonical/react-components";
import { RepositoryProfileFormValues } from "../../types";
import RepositoryProfileFormSearch from "../RepositoryProfileFormSearch";
import { Distribution } from "@/features/mirrors";
import { getFilteredDistributionPocketOptions } from "./helpers";
import classes from "./RepositoryProfileFormPocketsPanel.module.scss";

interface RepositoryProfileFormPocketsPanelProps {
  distributions: Distribution[];
  formik: FormikContextType<RepositoryProfileFormValues>;
}

const RepositoryProfileFormPocketsPanel: FC<
  RepositoryProfileFormPocketsPanelProps
> = ({ distributions, formik }) => {
  const [search, setSearch] = useState("");

  const filteredDistributionPocketOptions =
    getFilteredDistributionPocketOptions(distributions, search);

  return (
    <>
      <RepositoryProfileFormSearch
        label="Search for pockets"
        onSearchChange={(searchText) => setSearch(searchText)}
      />

      <fieldset
        className={classNames("checkbox-group", {
          "is-error": formik.touched.pockets && formik.errors.pockets,
        })}
      >
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

        {filteredDistributionPocketOptions.length === 0 && (
          <p>{`No pockets found with the search: "${search}".`}</p>
        )}

        {filteredDistributionPocketOptions.length > 0 && (
          <ul className="p-list--divided u-no-margin--bottom">
            {filteredDistributionPocketOptions.map(
              ({ distributionName, series }) => (
                <li key={distributionName} className="p-list__item">
                  <Row className="u-no-padding--left u-no-padding--right">
                    <Col small={1} medium={2} size={3}>
                      <p
                        className={classNames(
                          "u-no-margin--bottom",
                          classes.label,
                        )}
                      >
                        {distributionName}
                      </p>
                    </Col>
                    <Col small={3} medium={4} size={9}>
                      <ul className="p-list--divided u-no-padding--top u-no-margin--left">
                        {series.map(({ seriesName, pockets }) => (
                          <li key={seriesName} className="p-list__item">
                            <Row className="u-no-padding--left u-no-padding--right">
                              <Col small={1} medium={2} size={4}>
                                <p className="u-no-margin--bottom">
                                  {seriesName}
                                </p>
                              </Col>
                              <Col small={2} medium={2} size={5}>
                                <ul className="p-list--divided u-no-padding--top u-no-margin--left">
                                  {pockets.map(({ pocketName, value }) => (
                                    <li key={value} className="p-list__item">
                                      <CheckboxInput
                                        label={pocketName}
                                        labelClassName={classes.label}
                                        {...formik.getFieldProps("pockets")}
                                        checked={formik.values.pockets.includes(
                                          value,
                                        )}
                                        onChange={() =>
                                          formik.setFieldValue(
                                            "pockets",
                                            formik.values.pockets.includes(
                                              value,
                                            )
                                              ? formik.values.pockets.filter(
                                                  (item) => item !== value,
                                                )
                                              : [
                                                  ...formik.values.pockets,
                                                  value,
                                                ],
                                          )
                                        }
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </Col>
                            </Row>
                          </li>
                        ))}
                      </ul>
                    </Col>
                  </Row>
                </li>
              ),
            )}
          </ul>
        )}
      </fieldset>
      <p className="p-form-help-text">
        {`${formik.values.pockets.length} selected`}
      </p>
    </>
  );
};

export default RepositoryProfileFormPocketsPanel;
