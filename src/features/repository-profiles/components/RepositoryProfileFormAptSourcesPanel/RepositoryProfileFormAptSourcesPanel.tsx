import classNames from "classnames";
import { FormikContextType } from "formik";
import { FC, useState } from "react";
import { CheckboxInput, Col, Row } from "@canonical/react-components";
import RepositoryProfileFormSearch from "../RepositoryProfileFormSearch";
import { RepositoryProfileFormValues } from "../../types";
import { APTSource } from "@/features/apt-sources";
import { getFilteredAptSources } from "./helpers";

interface RepositoryProfileFormAptSourcesPanelProps {
  aptSources: APTSource[];
  formik: FormikContextType<RepositoryProfileFormValues>;
}

const RepositoryProfileFormAptSourcesPanel: FC<
  RepositoryProfileFormAptSourcesPanelProps
> = ({ aptSources, formik }) => {
  const [search, setSearch] = useState("");

  const filteredAptSources = getFilteredAptSources(aptSources, search);

  return (
    <>
      <RepositoryProfileFormSearch
        label="Search for APT sources"
        onSearchChange={(searchText) => setSearch(searchText)}
      />
      <fieldset
        className={classNames("checkbox-group", {
          "is-error": formik.touched.apt_sources && formik.errors.apt_sources,
        })}
      >
        <Row className="u-no-padding--left u-no-padding--right">
          <Col small={1} medium={2} size={4}>
            <p className="p-heading--5 p-text--small p-text--small-caps">
              Name
            </p>
          </Col>
          <Col small={3} medium={4} size={8}>
            <p className="p-heading--5 p-text--small p-text--small-caps">
              Line
            </p>
          </Col>
        </Row>

        {filteredAptSources.length === 0 && (
          <p>{`No APT sources found with the search: "${search}".`}</p>
        )}

        {filteredAptSources.length > 0 && (
          <ul className="p-list--divided u-no-margin--bottom">
            {filteredAptSources.map(({ id, line, name }) => (
              <li key={name} className="p-list__item">
                <Row className="u-no-padding--left u-no-padding--right">
                  <Col small={1} medium={2} size={4}>
                    <CheckboxInput
                      label={name}
                      {...formik.getFieldProps("apt_sources")}
                      checked={formik.values.apt_sources.includes(id)}
                      onChange={() =>
                        formik.setFieldValue(
                          "apt_sources",
                          formik.values.apt_sources.includes(id)
                            ? formik.values.apt_sources.filter(
                                (item) => item !== id,
                              )
                            : [...formik.values.apt_sources, id],
                        )
                      }
                    />
                  </Col>
                  <Col small={3} medium={4} size={8}>
                    <p className="u-no-margin--bottom u-truncate" title={line}>
                      {line}
                    </p>
                  </Col>
                </Row>
              </li>
            ))}
          </ul>
        )}
      </fieldset>
    </>
  );
};

export default RepositoryProfileFormAptSourcesPanel;
