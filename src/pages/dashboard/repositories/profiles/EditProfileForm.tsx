import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  CheckboxInput,
  Col,
  Form,
  Input,
  Row,
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
import classes from "./Profile.module.scss";
import PackageList from "../PackageList";

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
  tags: Yup.array()
    .of(Yup.string().required())
    .required("This field is required. Tags have to be separated by coma."),
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
  const debug = useDebug();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();

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

  const distributionPocketOptions = distributions.map(
    ({ name: distributionName, series }) => ({
      distributionName,
      series: series.map(({ name: seriesName, pockets }) => ({
        seriesName,
        pockets: pockets.map(({ name: pocketName }) => ({
          pocketName,
          value: `${distributionName}/${seriesName}/${pocketName}`,
        })),
      })),
    })
  );

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
            })
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
                })
          );
        }

        if (
          profile.tags.length &&
          (profile.tags.length !== values.tags.length ||
            !profile.tags.every((tag) => values.tags.includes(tag)))
        ) {
          const associateArray: string[] = [];
          const disassociateArray: string[] = [];

          profile.tags.forEach((tag) => {
            if (!values.tags.includes(tag)) {
              disassociateArray.push(tag);
            }
          });

          values.tags.forEach((tag) => {
            if (!profile.tags.includes(tag)) {
              associateArray.push(tag);
            }
          });

          promises.push(
            associateRepositoryProfile({
              name: values.name,
              tags: associateArray,
            }),
            disassociateRepositoryProfile({
              name: values.name,
              tags: disassociateArray,
            })
          );
        }

        const aptSourcesAdded = values.apt_sources
          .filter((x) => x)
          .filter((apt_source) => !profile.apt_sources.includes(apt_source));
        const aptSourcesRemoved = profile.apt_sources.filter(
          (apt_source) => !values.apt_sources.includes(apt_source)
        );

        if (aptSourcesAdded.length) {
          promises.push(
            addAPTSourcesToRepositoryProfile({
              name: values.name,
              apt_sources: aptSourcesAdded,
            })
          );
        }

        if (aptSourcesRemoved.length) {
          for (const aptSourceRemoved of aptSourcesRemoved) {
            promises.push(
              removeAPTSourceFromRepositoryProfile({
                name: values.name,
                apt_source: aptSourceRemoved,
              })
            );
          }
        }

        const profilePocketNames = profile.pockets.map(({ name }) => name);

        if (
          values.pockets.length !== profile.pockets.length ||
          !values.pockets.every((pocket) => profilePocketNames.includes(pocket))
        ) {
          const profilePocketsAdded = values.pockets.filter(
            (pocket) => !profilePocketNames.includes(pocket)
          );
          const profilePocketsRemoved = profilePocketNames.filter(
            (profilePocketName) => !values.pockets.includes(profilePocketName)
          );

          if (profilePocketsAdded.length) {
            for (const {
              distributionName,
              series,
            } of distributionPocketOptions) {
              for (const { seriesName, pockets } of series) {
                const seriesPockets: string[] = [];

                for (const { pocketName } of pockets) {
                  if (
                    profilePocketsAdded.includes(
                      `${distributionName}/${seriesName}/${pocketName}`
                    )
                  ) {
                    seriesPockets.push(pocketName);
                  }

                  if (seriesPockets.length) {
                    promises.push(
                      addPocketsToRepositoryProfile({
                        name: values.name,
                        series: seriesName,
                        distribution: distributionName,
                        pockets: seriesPockets,
                      })
                    );
                  }
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
                const seriesPockets: string[] = [];

                for (const { pocketName } of pockets) {
                  if (
                    profilePocketsRemoved.includes(
                      `${distributionName}/${seriesName}/${pocketName}`
                    )
                  ) {
                    seriesPockets.push(pocketName);
                  }

                  if (seriesPockets.length) {
                    promises.push(
                      removePocketsFromRepositoryProfile({
                        name: values.name,
                        series: seriesName,
                        distribution: distributionName,
                        pockets: seriesPockets,
                      })
                    );
                  }
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
    formik.setFieldValue(
      "pockets",
      profile.pockets.map(({ name, apt_source_line }) => {
        const aptParts = apt_source_line.split(" ");

        const regExpMatchArr = aptParts[1].match(/\/([-+\w]+)$/);

        const distributionName =
          null !== regExpMatchArr ? regExpMatchArr[1] : "";

        const seriesName = aptParts[2].replace(name, "").replace(/-$/, "");

        return `${distributionName}/${seriesName}/${name}`;
      })
    );
  }, []);

  const { data: getAPTSourcesResponse } = getAPTSourcesQuery();

  const aptSources = getAPTSourcesResponse?.data ?? [];

  return (
    <Form onSubmit={formik.handleSubmit}>
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
            event.target.value.replace(/\s/g, "").split(",")
          );
        }}
        disabled={formik.values.all_computers}
      />

      <fieldset
        className={classNames("checkbox-group", {
          "is-error": formik.touched.apt_sources && formik.errors.apt_sources,
        })}
      >
        <legend>APT sources</legend>

        {formik.touched.apt_sources && formik.errors.apt_sources && (
          <p className="p-form-validation__message">
            {formik.errors.apt_sources}
          </p>
        )}

        <div className="checkbox-group__inner">
          {aptSources
            .map(({ name }) => ({
              value: name,
              label: name,
            }))
            .map((option) => (
              <CheckboxInput
                key={option.value}
                label={option.label}
                {...formik.getFieldProps("apt_sources")}
                checked={formik.values.apt_sources.includes(option.value)}
                onChange={() =>
                  formik.setFieldValue(
                    "apt_sources",
                    formik.values.apt_sources.includes(option.value)
                      ? formik.values.apt_sources.filter(
                          (item) => item !== option.value
                        )
                      : [...formik.values.apt_sources, option.value]
                  )
                }
              />
            ))}
        </div>
      </fieldset>

      <fieldset
        className={classNames("checkbox-group", classes.background, {
          "is-error": formik.touched.pockets && formik.errors.pockets,
        })}
      >
        <legend>Pockets</legend>

        {formik.touched.pockets && formik.errors.pockets && (
          <p className="p-form-validation__message">{formik.errors.pockets}</p>
        )}

        <ul className="p-list--divided u-no-margin--bottom">
          {distributionPocketOptions.map(({ distributionName, series }) => (
            <li key={distributionName} className="p-list__item">
              <p>{distributionName}</p>
              <ul className="p-list--divided">
                {series.map(({ seriesName, pockets }) => (
                  <li key={seriesName} className="p-list__item">
                    <Row className="u-no-padding--left u-no-padding--right">
                      <Col
                        size={4}
                        className={classNames(classes.series, classes.label)}
                      >
                        <span>{seriesName}</span>
                      </Col>
                      <Col size={8}>
                        <ul className="p-list--divided u-no-padding--top">
                          {pockets.map(({ pocketName, value }) => (
                            <li
                              key={value}
                              className={classNames(
                                "p-list__item",
                                classes.label
                              )}
                            >
                              <CheckboxInput
                                label={
                                  <Button
                                    appearance="link"
                                    className="u-no-margin--bottom u-no-padding--top"
                                    onClick={() => {
                                      setSidePanelContent(
                                        `${seriesName} ${pocketName}`,
                                        <PackageList
                                          pocket={
                                            distributions
                                              .filter(
                                                ({ name }) =>
                                                  name === distributionName
                                              )[0]
                                              .series.filter(
                                                ({ name }) =>
                                                  name === seriesName
                                              )[0]
                                              .pockets.filter(
                                                ({ name }) =>
                                                  name === pocketName
                                              )[0]
                                          }
                                          distributionName={distributionName}
                                          seriesName={seriesName}
                                        />
                                      );
                                    }}
                                  >
                                    {pocketName}
                                  </Button>
                                }
                                {...formik.getFieldProps("pockets")}
                                checked={formik.values.pockets.includes(value)}
                                onChange={() =>
                                  formik.setFieldValue(
                                    "pockets",
                                    formik.values.pockets.includes(value)
                                      ? formik.values.pockets.filter(
                                          (item) => item !== value
                                        )
                                      : [...formik.values.pockets, value]
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
            </li>
          ))}
        </ul>
      </fieldset>
      <p className="p-form-help-text">
        {`${formik.values.pockets.length} selected`}
      </p>

      <div className="form-buttons">
        <Button
          type="submit"
          appearance="positive"
          disabled={
            isEditing ||
            isAssociating ||
            isDisassociating ||
            isAddingAPTSourcesToRepositoryProfile ||
            isRemovingAPTSourceFromRepositoryProfile ||
            isAddingPocketsToRepositoryProfile ||
            isRemovingPocketsFromRepositoryProfile
          }
        >
          Edit profile
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EditProfileForm;
