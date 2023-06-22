import { FC } from "react";
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
import classes from "./Profile.module.scss";
import PackageList from "../PackageList";

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
  tags: Yup.array()
    .of(Yup.string().required())
    .required("This field is required. Tags have to be separated by coma."),
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
  const debug = useDebug();
  const { closeSidePanel, setSidePanelContent } = useSidePanel();

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

  const { data: accessGroupsResponse, isLoading: isGettingAccessGroups } =
    getAccessGroupQuery();

  const accessGroupsOptions = (accessGroupsResponse?.data ?? []).map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    })
  );

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Title"
        required
        error={formik.touched.title && formik.errors.title}
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
        error={formik.touched.access_group && formik.errors.access_group}
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
            isCreating ||
            isAssociating ||
            isAddingAPTSourcesToRepositoryProfile ||
            isAddingPocketsToRepositoryProfile
          }
        >
          Create profile
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AddProfileForm;
