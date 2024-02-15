import { Button, Col, MainTable, Row } from "@canonical/react-components";
import classNames from "classnames";
import { FC, lazy, Suspense, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import InfoItem from "../../../components/layout/InfoItem";
import LoadingState from "../../../components/layout/LoadingState";
import PageContent from "../../../components/layout/PageContent";
import PageHeader from "../../../components/layout/PageHeader";
import PageMain from "../../../components/layout/PageMain";
import useSidePanel from "../../../hooks/useSidePanel";
import useUserDetails from "../../../hooks/useUserDetails";
import { UserDetails } from "../../../types/UserDetails";
import distributionCardClasses from "../repositories/mirrors/DistributionCard.module.scss";
import seriesCardClasses from "../repositories/mirrors/SeriesCard.module.scss";
import tableClasses from "../repositories/mirrors/SeriesPocketList.module.scss";
import UserAccountActionButtons from "./UserAccountActionButtons";
import userPageClasses from "./UserPage.module.scss";
import { buildTableRows, getAccountRows, getColumnSize } from "./_helpers";
import infoPanelClasses from "../instances/[single]/tabs/info/InfoPanel.module.scss";

const EditUserForm = lazy(() => import("./EditUserForm"));

const UserPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getUserDetails, getUserApiCredentials } = useUserDetails();
  const [openDropdown, setOpenDropdown] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 620px)");
  const isExtraLargeScreen = useMediaQuery("(min-width: 1681px)");
  const { data: userData, isLoading: isLoadingUserData } = getUserDetails();
  const { data: credentialsData, isLoading: isLoadingCredentialsData } =
    getUserApiCredentials();

  const user = userData?.data;
  const credentials = credentialsData?.data?.credentials;
  const isLoading = isLoadingUserData || isLoadingCredentialsData;
  const loaded = user && credentials;

  const userPersonalDetails = [
    {
      label: "email",
      value: user?.email,
    },
    {
      label: "timezone",
      value: user?.timezone,
    },
    {
      label: "identity",
      value: <code>{user?.identity}</code>,
    },
  ];

  const handleEditUser = () => {
    setSidePanelContent(
      "Edit details",
      <Suspense fallback={<LoadingState />}>
        <EditUserForm user={user as UserDetails} />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      {isLoading && <LoadingState />}
      {loaded && (
        <>
          <PageHeader
            title={user.name}
            actions={[
              <Button
                key="user-edit-button"
                type="button"
                appearance="positive"
                onClick={handleEditUser}
                aria-label={`Edit user ${user.name}`}
              >
                Edit
              </Button>,
            ]}
          />
          <PageContent>
            <>
              <h2
                className={classNames(
                  "p-heading--4 u-no-margin--bottom u-no-padding--top",
                  distributionCardClasses.title,
                )}
              >
                General Information
              </h2>
              <div className={infoPanelClasses.infoRow}>
                <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
                  {userPersonalDetails.map(({ label, value }) => (
                    <Col size={label === "identity" ? 6 : 3} key={label}>
                      <InfoItem label={label} value={value} />
                    </Col>
                  ))}
                </Row>
              </div>
              <div
                className={classNames(
                  distributionCardClasses.titleGroup,
                  userPageClasses.tableHeader,
                )}
              >
                <h2
                  className={classNames(
                    "p-heading--4 u-no-padding--top",
                    distributionCardClasses.title,
                  )}
                >
                  Accounts and Roles
                </h2>
              </div>
              <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
                {user.accounts.map((account, index) => {
                  const accountCredentials = credentials.find(
                    (cred) => cred.account_name === account.name,
                  );
                  const accRow = getAccountRows({
                    ...account,
                    credentials: accountCredentials,
                  });
                  const tableRows = buildTableRows(accRow);

                  return (
                    <Col
                      size={getColumnSize(
                        user.accounts.length,
                        index,
                        isExtraLargeScreen,
                      )}
                      key={account.title}
                      className={distributionCardClasses.item}
                    >
                      <div className={seriesCardClasses.card}>
                        <div className={seriesCardClasses.header}>
                          <p className={seriesCardClasses.title}>
                            {account.title}
                            {user.preferred_account === account.name && (
                              <em
                                className={classNames(
                                  "u-text--muted",
                                  userPageClasses.isDefaultBadge,
                                )}
                              >
                                Default
                              </em>
                            )}
                          </p>
                          {isLargeScreen ? (
                            <UserAccountActionButtons
                              accountName={account.name}
                              credentials={accountCredentials}
                              isLargeScreen={isLargeScreen}
                              preferredAccount={
                                user.preferred_account === account.name
                              }
                            />
                          ) : (
                            <span className="p-contextual-menu">
                              <Button
                                className="p-contextual-menu__toggle u-no-margin--bottom"
                                aria-controls="account-section-cta"
                                aria-expanded={openDropdown}
                                aria-haspopup="true"
                                onClick={() => {
                                  setOpenDropdown((prevState) => !prevState);
                                }}
                                onBlur={() => {
                                  setOpenDropdown(false);
                                }}
                              >
                                Actions
                              </Button>
                              <span
                                className="p-contextual-menu__dropdown"
                                id="account-section-cta"
                                aria-hidden={!openDropdown}
                              >
                                <UserAccountActionButtons
                                  accountName={account.name}
                                  credentials={accountCredentials}
                                  isLargeScreen={isLargeScreen}
                                  preferredAccount={
                                    user.preferred_account === account.name
                                  }
                                  className="p-contextual-menu__link"
                                />
                              </span>
                            </span>
                          )}
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
                                  userPageClasses.apiCredentials,
                                )}
                              >
                                <Col size={2} small={2}>
                                  <InfoItem
                                    label=""
                                    value={row.columns[0].content}
                                  />
                                </Col>
                                <Col size={2} small={2}>
                                  <InfoItem
                                    label=""
                                    value={row.columns[1].content}
                                  />
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
          </PageContent>
        </>
      )}
    </PageMain>
  );
};

export default UserPage;
