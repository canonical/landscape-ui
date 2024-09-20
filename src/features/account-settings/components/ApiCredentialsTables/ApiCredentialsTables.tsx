import InfoItem from "@/components/layout/InfoItem";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useUserDetails from "@/hooks/useUserDetails";
import distributionCardClasses from "@/pages/dashboard/repositories/mirrors/DistributionCard.module.scss";
import seriesCardClasses from "@/pages/dashboard/repositories/mirrors/SeriesCard.module.scss";
import { Credential, UserDetails } from "@/types/UserDetails";
import { Button, Col, ModularTable, Row } from "@canonical/react-components";
import classNames from "classnames";
import React, { FC, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import classes from "./ApiCredentialsTables.module.scss";
import { Column } from "@canonical/react-components/node_modules/@types/react-table";
import { NOT_AVAILABLE } from "@/constants";

interface ApiCredentialsTablesProps {
  user: UserDetails;
  credentials: Credential[];
}

const ApiCredentialsTables: FC<ApiCredentialsTablesProps> = ({
  user,
  credentials,
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 620px)");
  const { confirmModal, closeConfirmModal } = useConfirm();
  const debug = useDebug();
  const { generateApiCredentials } = useUserDetails();

  const { mutateAsync: mutateGenerateApiCredentials } = generateApiCredentials;

  const handleGenerateKeysMutation = async (accountName: string) => {
    try {
      await mutateGenerateApiCredentials({
        account: accountName,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleGenerateKeys = ({
    accountName,
    accountTitle,
    action,
  }: {
    accountName: string;
    accountTitle: string;
    action: string;
  }) => {
    confirmModal({
      title: `${action} API credentials for ${accountTitle}`,
      body: `${
        action === "Regenerate"
          ? `${action.slice(0, -1)}ing your API credentials will make your previously used credentials obsolete and deauthenticate any clients using them. `
          : ``
      }This action will create new credentials for integrating with the ${accountTitle} organisation`,
      buttons: [
        <Button
          key="confirm-generate-credentials"
          appearance="negative"
          hasIcon
          onClick={() => handleGenerateKeysMutation(accountName)}
          aria-label={`${action} API credentials confirmation for ${accountTitle}`}
        >
          {action} API credentials
        </Button>,
      ],
    });
  };

  const columns = useMemo<Column<{ label: string; value: React.ReactNode }>[]>(
    () => [
      {
        Header: "Label",
        accessor: "label",
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: ({ value }: { value: React.ReactNode }) => value,
      },
    ],
    [user, credentials],
  );

  return user.accounts.map((account) => {
    const accountCredentials = credentials.find(
      (cred) => cred.account_name === account.name,
    );

    const data = [
      { label: "Name", value: accountCredentials?.account_name },
      { label: "Title", value: accountCredentials?.account_title },
      { label: "Identity", value: <code>{user.identity}</code> },
      {
        label: "Endpoint",
        value: <code>{accountCredentials?.endpoint}</code>,
      },
      {
        label: "Access Key",
        value: accountCredentials?.access_key ? (
          <code>{accountCredentials.access_key}</code>
        ) : (
          NOT_AVAILABLE
        ),
      },
      {
        label: "Secret Key",
        value: accountCredentials?.secret_key ? (
          <code>{accountCredentials.secret_key}</code>
        ) : (
          NOT_AVAILABLE
        ),
      },
      { label: "Roles", value: account.roles.join(", ") },
    ];

    const action =
      accountCredentials?.secret_key || accountCredentials?.access_key
        ? "Regenerate"
        : "Generate";

    return (
      <div key={account.title} className={distributionCardClasses.item}>
        <div className={seriesCardClasses.card}>
          <div className={seriesCardClasses.header}>
            <p className={seriesCardClasses.title}>{account.title}</p>
            <Button
              className={classNames("u-no-margin--bottom", {
                "is-small": isLargeScreen,
              })}
              onClick={() =>
                handleGenerateKeys({
                  accountName: account.name,
                  accountTitle: account.title,
                  action,
                })
              }
            >
              <span>{action} API credentials</span>
            </Button>
          </div>
          <div
            className={classNames(
              seriesCardClasses.content,
              classes.tableWrapper,
            )}
          >
            {isLargeScreen ? (
              <ModularTable
                columns={columns}
                data={data}
                emptyMsg="No data available"
              />
            ) : (
              data.map((row, index) => (
                <Row
                  key={index}
                  className={classNames(
                    "u-no-padding--left u-no-padding--right",
                    classes.apiCredentials,
                  )}
                >
                  <Col size={2} small={2}>
                    <InfoItem label="" value={row.label} />
                  </Col>
                  <Col size={2} small={2}>
                    <InfoItem label="" value={row.value} />
                  </Col>
                </Row>
              ))
            )}
          </div>
        </div>
      </div>
    );
  });
};

export default ApiCredentialsTables;
