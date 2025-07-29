import CheckboxGroup from "@/components/form/CheckboxGroup";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  Form,
  Icon,
  Input,
  Tooltip,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect } from "react";
import { Link } from "react-router";
import type { AddProviderParams } from "../../hooks";
import { useAuthHandle } from "../../hooks";
import type { IdentityProvider, SupportedIdentityProvider } from "../../types";
import ProviderFormCta from "../ProviderFormCta";
import {
  INITIAL_VALUES,
  SCOPES_DEFAULT_VALUES,
  SCOPES_OPTIONS,
} from "./constants";
import { getValidationSchema } from "./helpers";
import classes from "./ProviderForm.module.scss";
import type { ProviderFormValues } from "./types";
import { useCopyToClipboard } from "usehooks-ts";
import { getFormikError } from "@/utils/formikErrors";

type ProvideFormProps =
  | {
      action: "add";
      provider: SupportedIdentityProvider;
    }
  | {
      action: "edit";
      canBeDisabled: boolean;
      provider: IdentityProvider;
    };

const ProviderForm: FC<ProvideFormProps> = (props) => {
  const { action, provider } = props;

  const [, copy] = useCopyToClipboard();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const {
    getSingleProviderQuery,
    addProviderQuery,
    updateProviderQuery,
    toggleUbuntuOneQuery,
  } = useAuthHandle();

  const { data: getSingleProviderQueryResult } = getSingleProviderQuery(
    { providerId: action === "edit" ? provider.id : 0 },
    { enabled: action === "edit" && provider.provider !== "ubuntu-one" },
  );

  const { mutateAsync: addProvider } = addProviderQuery;
  const { mutateAsync: updateProvider } = updateProviderQuery;
  const { mutateAsync: toggleUbuntuOne } = toggleUbuntuOneQuery;

  const handleSubmit = async (values: ProviderFormValues) => {
    const commonValuesToSubmit: AddProviderParams = {
      configuration: {
        issuer: values.issuer,
        client_id: values.client_id,
        client_secret: values.client_secret,
        name: values.name,
        provider: action === "add" ? provider.provider_slug : provider.provider,
      },
      enabled: values.enabled,
    };

    try {
      if (action === "add") {
        await addProvider(commonValuesToSubmit);
      } else {
        if (provider.provider === "ubuntu-one") {
          await toggleUbuntuOne({
            ubuntu_one: values.enabled,
          });
        } else {
          await updateProvider({
            ...commonValuesToSubmit,
            providerId: provider.id,
          });
        }
      }

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(action === "edit" ? provider : null),
  });

  useEffect(() => {
    if (action !== "edit" || provider.provider !== "ubuntu-one") {
      return;
    }

    formik.setFieldValue("enabled", provider.enabled);
  }, [action, provider]);

  useEffect(() => {
    if (!getSingleProviderQueryResult) {
      return;
    }

    formik.setValues({
      client_id: getSingleProviderQueryResult.data.configuration.client_id,
      client_secret:
        getSingleProviderQueryResult.data.configuration.client_secret,
      enabled: getSingleProviderQueryResult.data.enabled,
      issuer: getSingleProviderQueryResult.data.configuration.issuer,
      name: getSingleProviderQueryResult.data.configuration.name,
    });
  }, [getSingleProviderQueryResult]);

  const disabled =
    action === "edit" &&
    !props.canBeDisabled &&
    getSingleProviderQueryResult?.data.enabled;

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {(action !== "edit" || provider.provider !== "ubuntu-one") && (
        <div className={classes.container}>
          <span>Callback URL </span>
          <Icon name="information" />
          <div className={classes.urlContainer}>
            <code className={classes.url}>
              {action === "add"
                ? provider.redirect_uri
                : getSingleProviderQueryResult?.data.redirect_uri}
            </code>
            <Button
              className={classes.copyButton}
              type="button"
              onClick={() => {
                copy(
                  action === "add"
                    ? (provider.redirect_uri ?? "")
                    : (getSingleProviderQueryResult?.data.redirect_uri ?? ""),
                );
              }}
            >
              copy
            </Button>
          </div>
          <p className="p-text--small u-text--muted u-no-margin--bottom">
            You will need to set this in the configuration of your identity
            provider.
          </p>
        </div>
      )}

      <Tooltip
        message={
          disabled &&
          "At least one identity provider must be active on the Landscape account."
        }
      >
        <Input
          type="checkbox"
          label="Enabled"
          {...formik.getFieldProps("enabled")}
          checked={formik.values.enabled}
          disabled={disabled}
          help={`If checked the identity provider will be enabled. ${
            action === "add" ? "when it is created." : "for logging in."
          }`}
        />
      </Tooltip>

      {(action !== "edit" || provider.provider !== "ubuntu-one") && (
        <>
          <Input
            type="text"
            label="Name"
            required
            {...formik.getFieldProps("name")}
            autoComplete="off"
            error={getFormikError(formik, "name")}
          />
          <Input
            type="text"
            label="Client ID"
            required
            {...formik.getFieldProps("client_id")}
            autoComplete="off"
            error={getFormikError(formik, "client_id")}
          />
          <Input
            type="text"
            label="Client Secret"
            required
            {...formik.getFieldProps("client_secret")}
            autoComplete="off"
            error={getFormikError(formik, "client_secret")}
          />

          <CheckboxGroup
            label="Scopes"
            name="scopes"
            help={
              <>
                Scopes control which user attributes (Claims) the Landscape gets
                access to. Read more about Scopes in the{" "}
                <Link
                  to="https://openid.net/specs/openid-connect-basic-1_0.html#Scopes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OIDC docs
                </Link>
                .
              </>
            }
            options={SCOPES_OPTIONS}
            value={SCOPES_DEFAULT_VALUES}
            disabled={true}
            onChange={() => {
              return;
            }}
          />
          <Input
            type="url"
            label="Issuer"
            required
            {...formik.getFieldProps("issuer")}
            autoComplete="off"
            error={getFormikError(formik, "issuer")}
          />
        </>
      )}

      <ProviderFormCta action={action} />
    </Form>
  );
};

export default ProviderForm;
