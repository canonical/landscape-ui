import { FC, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CheckboxInput,
  Col,
  Form,
  Input,
  Row,
  Tabs,
} from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import useRepositoryProfiles from "../../../../hooks/useRepositoryProfiles";
import { RepositoryProfile } from "../../../../types/RepositoryProfile";
import useDebug from "../../../../hooks/useDebug";
import { AxiosResponse } from "axios";
import { testLowercaseAlphaNumeric } from "../../../../utils/tests";
import classNames from "classnames";
import useAPTSources from "../../../../hooks/useAPTSources";
import useDistributions from "../../../../hooks/useDistributions";
import classes from "./ProfileForm.module.scss";
import {
  getDistributionPocketOptions,
  getFilteredAptSources,
  getFilteredDistributionPocketOptions,
  getFullProfilePocketNames,
} from "./_helpers";
import SidePanelFormButtons from "../../../../components/form/SidePanelFormButtons";

interface FormProps {
  name: string;
  title: string;
  description: string;
  tags: string[];
  all_computers: boolean;
  apt_sources: string[];
  pockets: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  title: Yup.string().test({
    test: (value) =>
      undefined === value || testLowercaseAlphaNumeric.test(value),
    message: testLowercaseAlphaNumeric.message,
  }),
  description: Yup.string().required("This field is required."),
  tags: Yup.array().of(Yup.string()),
  all_computers: Yup.boolean(),
  apt_sources: Yup.array().of(Yup.string()),
  pockets: Yup.array().of(Yup.string()),
});

const initialValues: FormProps = {
  name: "",
  title: "",
  description: "",
  tags: [],
  all_computers: false,
  apt_sources: [],
  pockets: [],
};

interface EditProfileFormProps {
  profile: RepositoryProfile;
}

const EditProfileForm: FC<EditProfileFormProps> = ({ profile }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchText, setSearchText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { getDistributionsQuery } = useDistributions();
  const { getAPTSourcesQuery } = useAPTSources();
  const {
    editRepositoryProfileQuery,
    associateRepositoryProfileQuery,
    disassociateRepositoryProfileQuery,
    addAPTSourcesToRepositoryProfileQuery,
    removeAPTSourceFromRepositoryProfileQuery,
    addPocketsToRepositoryProfileQuery,
    removePocketsFromRepositoryProfileQuery,
  } = useRepositoryProfiles();
  const { mutateAsync: editRepositoryProfile, isLoading: isEditing } =
    editRepositoryProfileQuery;
  const { mutateAsync: associateRepositoryProfile, isLoading: isAssociating } =
    associateRepositoryProfileQuery;
  const {
    mutateAsync: disassociateRepositoryProfile,
    isLoading: isDisassociating,
  } = disassociateRepositoryProfileQuery;
  const {
    mutateAsync: addAPTSourcesToRepositoryProfile,
    isLoading: isAddingAPTSourcesToRepositoryProfile,
  } = addAPTSourcesToRepositoryProfileQuery;
  const {
    mutateAsync: removeAPTSourceFromRepositoryProfile,
    isLoading: isRemovingAPTSourceFromRepositoryProfile,
  } = removeAPTSourceFromRepositoryProfileQuery;
  const {
    mutateAsync: addPocketsToRepositoryProfile,
    isLoading: isAddingPocketsToRepositoryProfile,
  } = addPocketsToRepositoryProfileQuery;
  const {
    mutateAsync: removePocketsFromRepositoryProfile,
    isLoading: isRemovingPocketsFromRepositoryProfile,
  } = removePocketsFromRepositoryProfileQuery;

  const { data: getDistributionsResponse } = getDistributionsQuery();

  const distributions = getDistributionsResponse?.data ?? [];

  const distributionPocketOptions = getDistributionPocketOptions(distributions);

  const filteredDistributionPocketOptions =
    getFilteredDistributionPocketOptions(distributionPocketOptions, searchText);

  const fullPocketNames = getFullProfilePocketNames(profile.pockets);

  const formik = useFormik<FormProps>({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        const promises: Promise<AxiosResponse<RepositoryProfile>>[] = [];

        if (
          ("" !== values.title && profile.title !== values.title) ||
          profile.description !== values.description
        ) {
          promises.push(
            editRepositoryProfile({
              name: values.name,
              title: values.title,
              description: values.description,
            }),
          );
        }

        if (profile.all_computers !== values.all_computers) {
          promises.push(
            values.all_computers
              ? associateRepositoryProfile({
                  name: values.name,
                  all_computers: true,
                })
              : disassociateRepositoryProfile({
                  name: values.name,
                  all_computers: true,
                }),
          );
        }

        const newTags = values.tags.filter((x) => x);

        if (
          newTags.length !== profile.tags.length ||
          !profile.tags.every((tag) => newTags.includes(tag))
        ) {
          const tagsAdded = newTags.filter(
            (tag) => !profile.tags.includes(tag),
          );
          const tagsRemoved = profile.tags.filter(
            (tag) => !newTags.includes(tag),
          );

          if (tagsAdded.length) {
            promises.push(
              associateRepositoryProfile({
                name: values.name,
                tags: tagsAdded,
              }),
            );
          }

          if (tagsRemoved.length) {
            promises.push(
              disassociateRepositoryProfile({
                name: values.name,
                tags: tagsRemoved,
              }),
            );
          }
        }

        if (
          values.apt_sources.length !== profile.apt_sources.length ||
          !profile.apt_sources.every((aptSource) =>
            values.apt_sources.includes(aptSource),
          )
        ) {
          const aptSourcesAdded = values.apt_sources.filter(
            (apt_source) => !profile.apt_sources.includes(apt_source),
          );
          const aptSourcesRemoved = profile.apt_sources.filter(
            (apt_source) => !values.apt_sources.includes(apt_source),
          );

          if (aptSourcesAdded.length) {
            promises.push(
              addAPTSourcesToRepositoryProfile({
                name: values.name,
                apt_sources: aptSourcesAdded,
              }),
            );
          }

          if (aptSourcesRemoved.length) {
            for (const aptSourceRemoved of aptSourcesRemoved) {
              promises.push(
                removeAPTSourceFromRepositoryProfile({
                  name: values.name,
                  apt_source: aptSourceRemoved,
                }),
              );
            }
          }
        }

        if (
          values.pockets.length !== profile.pockets.length ||
          !values.pockets.every((pocket) => fullPocketNames.includes(pocket))
        ) {
          const profilePocketsAdded = values.pockets.filter(
            (pocket) => !fullPocketNames.includes(pocket),
          );
          const profilePocketsRemoved = fullPocketNames.filter(
            (profilePocketName) => !values.pockets.includes(profilePocketName),
          );

          if (profilePocketsAdded.length) {
            for (const {
              distributionName,
              series,
            } of distributionPocketOptions) {
              for (const { seriesName, pockets } of series) {
                const seriesPocketNames: string[] = [];

                for (const { pocketName } of pockets) {
                  if (
                    profilePocketsAdded.includes(
                      `${distributionName}/${seriesName}/${pocketName}`,
                    )
                  ) {
                    seriesPocketNames.push(pocketName);
                  }
                }

                if (seriesPocketNames.length) {
                  promises.push(
                    addPocketsToRepositoryProfile({
                      name: values.name,
                      distribution: distributionName,
                      series: seriesName,
                      pockets: seriesPocketNames,
                    }),
                  );
                }
              }
            }
          }

          if (profilePocketsRemoved.length) {
            for (const {
              distributionName,
              series,
            } of distributionPocketOptions) {
              for (const { seriesName, pockets } of series) {
                const seriesPocketNames: string[] = [];

                for (const { pocketName } of pockets) {
                  if (
                    profilePocketsRemoved.includes(
                      `${distributionName}/${seriesName}/${pocketName}`,
                    )
                  ) {
                    seriesPocketNames.push(pocketName);
                  }
                }

                if (seriesPocketNames.length) {
                  promises.push(
                    removePocketsFromRepositoryProfile({
                      name: values.name,
                      distribution: distributionName,
                      series: seriesName,
                      pockets: seriesPocketNames,
                    }),
                  );
                }
              }
            }
          }
        }

        await Promise.all(promises);

        closeSidePanel();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("all_computers", profile.all_computers);
    formik.setFieldValue("description", profile.description);
    formik.setFieldValue("tags", profile.tags);
    formik.setFieldValue("title", profile.title);
    formik.setFieldValue("name", profile.name);
    formik.setFieldValue("apt_sources", profile.apt_sources);
    formik.setFieldValue("pockets", fullPocketNames);
  }, []);

  const { data: getAPTSourcesResponse } = getAPTSourcesQuery();

  const aptSources = getAPTSourcesResponse?.data ?? [];

  const filteredAptSources = getFilteredAptSources(aptSources, searchText);

  const handleClickTab = (tabIndex: number) => {
    setCurrentTab(tabIndex);
    setSearchText("");
  };

  return (
    <>
      <Tabs
        links={[
          {
            label: "Details",
            role: "tab",
            ["data-testid"]: "details-tab",
            active: 0 === currentTab,
            onClick: () => {
              handleClickTab(0);
            },
          },
          {
            label: "Pockets",
            role: "tab",
            ["data-testid"]: "pockets-tab",
            active: 1 === currentTab,
            onClick: () => {
              handleClickTab(1);
            },
          },
          {
            label: "Apt Sources",
            role: "tab",
            ["data-testid"]: "apt-sources-tab",
            active: 2 === currentTab,
            onClick: () => {
              handleClickTab(2);
            },
          },
        ]}
      />
      <Form onSubmit={formik.handleSubmit}>
        <div className={classes.formInner}>
          {0 === currentTab && (
            <>
              <Input
                type="text"
                label="Title"
                error={formik.touched.title && formik.errors.title}
                {...formik.getFieldProps("title")}
              />
              <Input
                type="text"
                label="Description"
                error={formik.touched.description && formik.errors.description}
                {...formik.getFieldProps("description")}
              />
              <CheckboxInput
                label="All computers"
                {...formik.getFieldProps("all_computers")}
                checked={formik.values.all_computers}
              />
              <Input
                type="text"
                label="Tags"
                error={
                  formik.touched.tags && formik.errors.tags
                    ? formik.errors.tags
                    : undefined
                }
                {...formik.getFieldProps("tags")}
                value={formik.values.tags.join(",")}
                onChange={(event) => {
                  formik.setFieldValue(
                    "tags",
                    event.target.value.replace(/\s/g, "").split(","),
                  );
                }}
                help="List the tag names separated by commas"
                disabled={formik.values.all_computers}
              />
            </>
          )}

          {[1, 2].includes(currentTab) && (
            <div className="p-search-box">
              <label className="u-off-screen" htmlFor="search">
                {`Search ${currentTab === 1 ? "pockets" : "APT sources"}`}
              </label>
              <input
                ref={inputRef}
                type="search"
                id="search"
                className="p-search-box__input"
                name="search"
                placeholder="Search"
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                }}
              />
              {searchText && (
                <button
                  type="reset"
                  className="p-search-box__reset"
                  onClick={() => {
                    if (!inputRef.current) {
                      return;
                    }

                    setSearchText("");
                    inputRef.current.focus();
                  }}
                  aria-label="Reset search"
                >
                  <i className="p-icon--close">Close</i>
                </button>
              )}
              <span
                className={classNames(
                  "p-search-box__button p-button--base",
                  classes.searchIcon,
                )}
              >
                <i className="p-icon--search">Search</i>
              </span>
            </div>
          )}

          {1 === currentTab && (
            <>
              <fieldset
                className={classNames("checkbox-group", {
                  "is-error": formik.touched.pockets && formik.errors.pockets,
                })}
              >
                <Row className="u-no-padding--left u-no-padding--right">
                  <Col small={1} medium={2} size={3}>
                    <h5
                      className={classNames(
                        "p-text--x-small",
                        classes.uppercase,
                      )}
                    >
                      Distribution
                    </h5>
                  </Col>
                  <Col small={1} medium={2} size={4}>
                    <h5
                      className={classNames(
                        "p-text--x-small",
                        classes.uppercase,
                      )}
                    >
                      Series
                    </h5>
                  </Col>
                  <Col small={2} medium={2} size={5}>
                    <h5
                      className={classNames(
                        "p-text--x-small",
                        classes.uppercase,
                      )}
                    >
                      Pocket
                    </h5>
                  </Col>
                </Row>

                {0 === filteredDistributionPocketOptions.length &&
                  distributionPocketOptions.length > 0 && (
                    <p>No pockets found.</p>
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
                                          {pockets.map(
                                            ({ pocketName, value }) => (
                                              <li
                                                key={value}
                                                className={classNames(
                                                  "p-list__item",
                                                  classes.label,
                                                )}
                                              >
                                                <CheckboxInput
                                                  label={pocketName}
                                                  {...formik.getFieldProps(
                                                    "pockets",
                                                  )}
                                                  checked={formik.values.pockets.includes(
                                                    value,
                                                  )}
                                                  onChange={() => {
                                                    formik.setFieldValue(
                                                      "pockets",
                                                      formik.values.pockets.includes(
                                                        value,
                                                      )
                                                        ? formik.values.pockets.filter(
                                                            (item) =>
                                                              item !== value,
                                                          )
                                                        : [
                                                            ...formik.values
                                                              .pockets,
                                                            value,
                                                          ],
                                                    );
                                                  }}
                                                />
                                              </li>
                                            ),
                                          )}
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
          )}

          {2 === currentTab && (
            <fieldset
              className={classNames("checkbox-group", {
                "is-error":
                  formik.touched.apt_sources && formik.errors.apt_sources,
              })}
            >
              <Row className="u-no-padding--left u-no-padding--right">
                <Col small={1} medium={2} size={4}>
                  <h5
                    className={classNames("p-text--x-small", classes.uppercase)}
                  >
                    Name
                  </h5>
                </Col>
                <Col small={3} medium={4} size={8}>
                  <h5
                    className={classNames("p-text--x-small", classes.uppercase)}
                  >
                    Line
                  </h5>
                </Col>
              </Row>

              {0 === filteredAptSources.length && aptSources.length > 0 && (
                <p>No APT sources found.</p>
              )}

              {filteredAptSources.length > 0 && (
                <ul className="p-list--divided u-no-margin--bottom">
                  {filteredAptSources.map(({ name, line }) => (
                    <li key={name} className="p-list__item">
                      <Row className="u-no-padding--left u-no-padding--right">
                        <Col small={1} medium={2} size={4}>
                          <CheckboxInput
                            label={name}
                            {...formik.getFieldProps("apt_sources")}
                            checked={formik.values.apt_sources.includes(name)}
                            onChange={() =>
                              formik.setFieldValue(
                                "apt_sources",
                                formik.values.apt_sources.includes(name)
                                  ? formik.values.apt_sources.filter(
                                      (item) => item !== name,
                                    )
                                  : [...formik.values.apt_sources, name],
                              )
                            }
                          />
                        </Col>
                        <Col small={3} medium={4} size={8}>
                          <p className="u-no-margin--bottom">{line}</p>
                        </Col>
                      </Row>
                    </li>
                  ))}
                </ul>
              )}
            </fieldset>
          )}

          <SidePanelFormButtons
            disabled={
              isEditing ||
              isAssociating ||
              isDisassociating ||
              isAddingAPTSourcesToRepositoryProfile ||
              isRemovingAPTSourceFromRepositoryProfile ||
              isAddingPocketsToRepositoryProfile ||
              isRemovingPocketsFromRepositoryProfile
            }
            bottomSticky={true}
            positiveButtonTitle="Save changes"
          />
        </div>
      </Form>
    </>
  );
};

export default EditProfileForm;
