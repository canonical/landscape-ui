import { FC, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  CheckboxInput,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tabs,
} from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import useRepositoryProfiles from "../../../../hooks/useRepositoryProfiles";
import useDebug from "../../../../hooks/useDebug";
import { testLowercaseAlphaNumeric } from "../../../../utils/tests";
import useAccessGroup from "../../../../hooks/useAccessGroup";
import useDistributions from "../../../../hooks/useDistributions";
import useAPTSources from "../../../../hooks/useAPTSources";
import classNames from "classnames";
import { AxiosResponse } from "axios";
import { RepositoryProfile } from "../../../../types/RepositoryProfile";
import classes from "./ProfileForm.module.scss";
import {
  getAccessGroupsOptions,
  getDistributionPocketOptions,
  getFilteredAptSources,
  getFilteredDistributionPocketOptions,
} from "./_helpers";

interface FormProps {
  title: string;
  description: string;
  access_group: string;
  tags: string[];
  all_computers: boolean;
  apt_sources: string[];
  pockets: string[];
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("This field is required.").test({
    test: testLowercaseAlphaNumeric.test,
    message: testLowercaseAlphaNumeric.message,
  }),
  description: Yup.string(),
  access_group: Yup.string(),
  tags: Yup.array().of(Yup.string()).strict(true),
  all_computers: Yup.boolean(),
  apt_sources: Yup.array().of(Yup.string()),
  pockets: Yup.array().of(Yup.string()),
});

const initialValues: FormProps = {
  title: "",
  description: "",
  access_group: "",
  tags: [],
  all_computers: false,
  apt_sources: [],
  pockets: [],
};

const AddProfileForm: FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchText, setSearchText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { getDistributionsQuery } = useDistributions();
  const { getAccessGroupQuery } = useAccessGroup();
  const { getAPTSourcesQuery } = useAPTSources();
  const {
    createRepositoryProfileQuery,
    associateRepositoryProfileQuery,
    addAPTSourcesToRepositoryProfileQuery,
    addPocketsToRepositoryProfileQuery,
  } = useRepositoryProfiles();

  const { mutateAsync: createRepositoryProfile, isLoading: isCreating } =
    createRepositoryProfileQuery;
  const { mutateAsync: associateRepositoryProfile, isLoading: isAssociating } =
    associateRepositoryProfileQuery;
  const {
    mutateAsync: addAPTSourcesToRepositoryProfile,
    isLoading: isAddingAPTSourcesToRepositoryProfile,
  } = addAPTSourcesToRepositoryProfileQuery;
  const {
    mutateAsync: addPocketsToRepositoryProfile,
    isLoading: isAddingPocketsToRepositoryProfile,
  } = addPocketsToRepositoryProfileQuery;

  const { data: getDistributionsResponse } = getDistributionsQuery();

  const distributions = getDistributionsResponse?.data ?? [];

  const distributionPocketOptions = getDistributionPocketOptions(distributions);

  const filteredDistributionPocketOptions =
    getFilteredDistributionPocketOptions(distributionPocketOptions, searchText);

  const formik = useFormik<FormProps>({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        const newProfile = (
          await createRepositoryProfile({
            title: values.title,
            description: values.description,
            access_group: values.access_group,
          })
        ).data;

        const promises: Promise<AxiosResponse<RepositoryProfile>>[] = [];

        if (values.all_computers) {
          promises.push(
            associateRepositoryProfile({
              name: newProfile.name,
              all_computers: true,
            })
          );
        } else if (values.tags.length) {
          promises.push(
            associateRepositoryProfile({
              name: newProfile.name,
              tags: values.tags,
            })
          );
        }

        const aptSources = values.apt_sources.filter((x) => x);

        if (aptSources.length) {
          promises.push(
            addAPTSourcesToRepositoryProfile({
              name: newProfile.name,
              apt_sources: aptSources,
            })
          );
        }

        if (values.pockets.length) {
          for (const {
            distributionName,
            series,
          } of distributionPocketOptions) {
            for (const { seriesName, pockets } of series) {
              const seriesPocketNames: string[] = [];

              for (const { pocketName } of pockets) {
                if (
                  values.pockets.includes(
                    `${distributionName}/${seriesName}/${pocketName}`
                  )
                ) {
                  seriesPocketNames.push(pocketName);
                }
              }

              if (seriesPocketNames.length) {
                promises.push(
                  addPocketsToRepositoryProfile({
                    name: newProfile.name,
                    distribution: distributionName,
                    series: seriesName,
                    pockets: seriesPocketNames,
                  })
                );
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

  const { data: getAPTSourcesResponse } = getAPTSourcesQuery();

  const aptSources = getAPTSourcesResponse?.data ?? [];

  const filteredAptSources = getFilteredAptSources(aptSources, searchText);

  const { data: accessGroupsResponse, isLoading: isGettingAccessGroups } =
    getAccessGroupQuery();

  const accessGroupsOptions = getAccessGroupsOptions(
    accessGroupsResponse?.data ?? []
  );

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
            active: 0 === currentTab,
            onClick: () => {
              handleClickTab(0);
            },
          },
          {
            label: "Pockets",
            active: 1 === currentTab,
            onClick: () => {
              handleClickTab(1);
            },
          },
          {
            label: "Apt Sources",
            active: 2 === currentTab,
            onClick: () => {
              handleClickTab(2);
            },
          },
        ]}
      />

      <Form onSubmit={formik.handleSubmit} noValidate>
        <div className={classes.formInner}>
          {0 === currentTab && (
            <>
              <Input
                type="text"
                label="Title"
                required
                error={formik.touched.title && formik.errors.title}
                onError={(event) => {
                  setCurrentTab(0);
                  event.currentTarget.focus();
                }}
                {...formik.getFieldProps("title")}
              />
              <Input
                type="text"
                label="Description"
                error={formik.touched.description && formik.errors.description}
                {...formik.getFieldProps("description")}
              />
              <Select
                label="Access group"
                options={[
                  { label: "Select access group", value: "" },
                  ...accessGroupsOptions,
                ]}
                error={
                  formik.touched.access_group && formik.errors.access_group
                }
                disabled={isGettingAccessGroups}
                {...formik.getFieldProps("access_group")}
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
                    event.target.value.replace(/\s/g, "").split(",")
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
                Search
              </label>
              <input
                ref={inputRef}
                type="search"
                id="search"
                className="p-search-box__input"
                name="search"
                placeholder="Search"
                required
              />
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
              >
                <i className="p-icon--close">Close</i>
              </button>
              <button
                type="button"
                className="p-search-box__button"
                onClick={() => {
                  if (!inputRef.current) {
                    return;
                  }

                  setSearchText(inputRef.current.value);
                }}
              >
                <i className="p-icon--search">Search</i>
              </button>
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
                        classes.uppercase
                      )}
                    >
                      Distribution
                    </h5>
                  </Col>
                  <Col small={1} medium={2} size={4}>
                    <h5
                      className={classNames(
                        "p-text--x-small",
                        classes.uppercase
                      )}
                    >
                      Series
                    </h5>
                  </Col>
                  <Col small={2} medium={2} size={5}>
                    <h5
                      className={classNames(
                        "p-text--x-small",
                        classes.uppercase
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
                                  classes.label
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
                                                className="p-list__item"
                                              >
                                                <CheckboxInput
                                                  label={pocketName}
                                                  labelClassName={classes.label}
                                                  {...formik.getFieldProps(
                                                    "pockets"
                                                  )}
                                                  checked={formik.values.pockets.includes(
                                                    value
                                                  )}
                                                  onChange={() =>
                                                    formik.setFieldValue(
                                                      "pockets",
                                                      formik.values.pockets.includes(
                                                        value
                                                      )
                                                        ? formik.values.pockets.filter(
                                                            (item) =>
                                                              item !== value
                                                          )
                                                        : [
                                                            ...formik.values
                                                              .pockets,
                                                            value,
                                                          ]
                                                    )
                                                  }
                                                />
                                              </li>
                                            )
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
                      )
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
                                      (item) => item !== name
                                    )
                                  : [...formik.values.apt_sources, name]
                              )
                            }
                          />
                        </Col>
                        <Col small={3} medium={4} size={8}>
                          <p
                            className="u-no-margin--bottom u-truncate"
                            title={line}
                          >
                            {line}
                          </p>
                        </Col>
                      </Row>
                    </li>
                  ))}
                </ul>
              )}
            </fieldset>
          )}

          <div className={classes.buttons}>
            <Button
              type="submit"
              appearance="positive"
              className="u-no-margin--bottom"
              disabled={
                isCreating ||
                isAssociating ||
                isAddingAPTSourcesToRepositoryProfile ||
                isAddingPocketsToRepositoryProfile
              }
            >
              Create profile
            </Button>
            <Button
              type="button"
              className="u-no-margin--bottom"
              onClick={closeSidePanel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default AddProfileForm;
