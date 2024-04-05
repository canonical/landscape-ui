import useUserDetails from "@/hooks/useUserDetails";
import classNames from "classnames";
import { FC } from "react";
import distributionCardClasses from "@/pages/dashboard/repositories/mirrors/DistributionCard.module.scss";
import seriesCardClasses from "@/pages/dashboard/repositories/mirrors/SeriesCard.module.scss";
import tableClasses from "@/pages/dashboard/repositories/mirrors/SeriesPocketList.module.scss";
import {
  Button,
  Col,
  MainTable,
  Row,
  Spinner,
} from "@canonical/react-components";
import classes from "./ApiCredentials.module.scss";
import { useMediaQuery } from "usehooks-ts";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import InfoItem from "@/components/layout/InfoItem";
import { Credential, UserDetails } from "@/types/UserDetails";

interface ApiCredentialsProps {
  user: UserDetails;
  credentials: Credential[];
}

const ApiCredentials: FC<ApiCredentialsProps> = ({ user, credentials }) => {
  const isLargeScreen = useMediaQuery("(min-width: 620px)");

  const { confirmModal, closeConfirmModal } = useConfirm();
  const debug = useDebug();
  const { generateApiCredentials } = useUserDetails();

  const {
    mutateAsync: mutateGenerateApiCredentials,
    isLoading: isLoadingCredentials,
  } = generateApiCredentials;

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

  const handleGenerateKeys = (accountName: string) => {
    confirmModal({
      body: "Are you sure you want to perform this action?",
      title: "Generate new API credentials",
      buttons: [
        <Button
          key="confirm-generate-credentials"
          appearance="positive"
          hasIcon={true}
          onClick={() => handleGenerateKeysMutation(accountName)}
          aria-label={`Confirm key generation for ${accountName}`}
        >
          {isLoadingCredentials && <Spinner />}
          Generate
        </Button>,
      ],
    });
  };

  return (
    <>
      <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
        {user.accounts.map((account) => {
          const accountCredentials = credentials.find(
            (cred) => cred.account_name === account.name,
          );
          const accRow = [
            { label: "Name", value: account.name },
            { label: "Title", value: account.title },
            {
              label: "Identity",
              value: <code>{user.identity}</code>,
            },
            {
              label: "Endpoint",
              value: <code>{accountCredentials?.endpoint ?? ""}</code>,
            },
            {
              label: "Access Key",
              value: <code>{accountCredentials?.access_key ?? ""}</code>,
            },
            {
              label: "Secret Key",
              value: <code>{accountCredentials?.secret_key ?? ""}</code>,
            },
            { label: "Roles", value: account.roles.join(", ") },
          ];

          const tableRows = accRow.map((item) => {
            return {
              columns: [
                {
                  content: item.label,
                  "aria-label": item.label,
                  className: "u-no-margin--bottom",
                },
                {
                  content: item.value,
                  "aria-label": `${item.label} value`,
                },
              ],
            };
          });

          const buttonTitle =
            accountCredentials?.secret_key || accountCredentials?.access_key
              ? "Regenerate API credentials"
              : "Generate API credentials";

          return (
            <Col
              size={12}
              key={account.title}
              className={distributionCardClasses.item}
            >
              <div className={seriesCardClasses.card}>
                <div className={seriesCardClasses.header}>
                  <p className={seriesCardClasses.title}>{account.title}</p>
                  <Button
                    className={classNames("u-no-margin--bottom", {
                      "is-small": isLargeScreen,
                    })}
                    onClick={() => handleGenerateKeys(account.name)}
                  >
                    <span>{buttonTitle}</span>
                  </Button>
                </div>
                <div className={seriesCardClasses.content}>
                  {isLargeScreen ? (
                    <MainTable
                      className={classNames(tableClasses.content)}
                      rows={tableRows}
                      emptyStateMsg="No data available"
                    />
                  ) : (
                    tableRows.map((row, index) => (
                      <Row
                        key={index}
                        className={classNames(
                          "u-no-padding--left u-no-padding--right",
                          tableClasses.pocketWrapper,
                          classes.apiCredentials,
                        )}
                      >
                        <Col size={2} small={2}>
                          <InfoItem label="" value={row.columns[0].content} />
                        </Col>
                        <Col size={2} small={2}>
                          <InfoItem label="" value={row.columns[1].content} />
                        </Col>
                      </Row>
                    ))
                  )}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default ApiCredentials;
