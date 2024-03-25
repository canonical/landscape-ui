import { FC, Suspense, useMemo, useState } from "react";
import { PackageProfile } from "@/features/package-profiles/types/PackageProfile";
import {
  Button,
  Col,
  Form,
  Icon,
  ModularTable,
  Row,
  SearchBox,
} from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import { CellProps, Column } from "react-table";
import {
  CONSTRAINT_OPTIONS,
  CONSTRAINT_RULE_OPTIONS,
} from "@/features/package-profiles/constants";
import { Constraint } from "@/features/package-profiles/types";
import classes from "./PackageProfileDetails.module.scss";
import classNames from "classnames";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import PackageProfileConstraintsEditForm from "@/features/package-profiles/PackageProfileConstraintsEditForm";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import usePackageProfiles from "@/features/package-profiles/hooks/usePackageProfiles";
import PackageProfileEditForm from "@/features/package-profiles/PackageProfileEditForm";
import PackageProfileDuplicateForm from "@/features/package-profiles/PackageProfileDuplicateForm";

interface PackageProfileDetailsProps {
  profile: PackageProfile;
}

const PackageProfileDetails: FC<PackageProfileDetailsProps> = ({ profile }) => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const debug = useDebug();
  const { setSidePanelContent, changeSidePanelTitleLabel } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removePackageProfileQuery } = usePackageProfiles();

  const constraintsData = useMemo(() => {
    const constraints = profile.constraints.map(
      (constraint): Constraint => ({
        ...constraint,
        notAnyVersion: !!constraint.version,
      }),
    );

    if (!search) {
      return constraints;
    }

    return constraints.filter((constraint) =>
      constraint.package.toLowerCase().includes(search.toLowerCase()),
    );
  }, [profile.constraints, search]);

  const columns = useMemo<Column<Constraint>[]>(
    () => [
      {
        accessor: "constraint",
        className: classes.constraint,
        Header: "Constraint",
        Cell: ({ row: { original } }: CellProps<Constraint>) =>
          CONSTRAINT_OPTIONS.find(({ value }) => value === original.constraint)
            ?.label ?? original.constraint,
      },
      {
        accessor: "package",
        Header: "Package",
      },
      {
        accessor: "version",
        Header: "Version",
        Cell: ({ row: { original } }: CellProps<Constraint>) =>
          original.version
            ? `${CONSTRAINT_RULE_OPTIONS.find(({ value }) => value === original.rule)?.label} ${original.version}`
            : "Any",
      },
    ],
    [constraintsData],
  );

  const handlePackageConstraintsChange = () => {
    setSidePanelContent(
      "Change package constraints",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsEditForm profile={profile} />
      </Suspense>,
      "medium",
    );
  };

  const { mutateAsync: removePackageProfile } = removePackageProfileQuery;

  const handleRemovePackageProfile = async (name: string) => {
    try {
      await removePackageProfile({ name });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemovePackageProfileDialog = (name: string) => {
    confirmModal({
      title: "Remove package profile",
      body: `This will remove "${name}" profile.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemovePackageProfile(name)}
          aria-label={`Remove ${name} profile`}
        >
          Remove
        </Button>,
      ],
    });
  };

  const handlePackageProfileEdit = () => {
    setSidePanelContent(
      "Edit package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handlePackageProfileDuplicate = () => {
    setSidePanelContent(
      "Duplicate package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileDuplicateForm profile={profile} />
      </Suspense>,
    );
    changeSidePanelTitleLabel("Step 1 of 2");
  };

  return (
    <>
      <div className="p-segmented-control u-align-text--right">
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handlePackageProfileDuplicate}
        >
          <Icon name="canvas" />
          <span>Duplicate profile</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handlePackageProfileEdit}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={() => handleRemovePackageProfileDialog(profile.name)}
        >
          <Icon name="delete" />
          <span>Remove</span>
        </Button>
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={3}>
          <InfoItem label="Name" value={profile.name} />
        </Col>
        <Col size={9}>
          <InfoItem label="Description" value={profile.description} />
        </Col>
        <Col size={3}>
          <InfoItem label="Access group" value={profile.access_group} />
        </Col>
        <Col size={9}>
          <InfoItem label="Tags" value={profile.tags.join(", ")} />
        </Col>
        <Col size={3}>
          <InfoItem
            label="Associated to"
            value={`${profile.computers.constrained.length} instances`}
          />
        </Col>
        <Col size={3}>
          <InfoItem
            label="Pending on"
            value={`${profile.computers.pending?.length ?? 0} instances`}
          />
        </Col>
        <Col size={3}>
          <InfoItem
            label="Not compliant on"
            value={`${profile.computers["non-compliant"].length} instances`}
          />
        </Col>
      </Row>

      <Row
        className={classNames(
          "u-no-padding--left u-no-padding--right",
          classes.actions,
        )}
      >
        <Col size={6}>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(inputText);
            }}
          >
            <SearchBox
              externallyControlled
              shouldRefocusAfterReset
              autoComplete="off"
              onSearch={() => setSearch(inputText)}
              onChange={(inputValue) => setInputText(inputValue)}
              value={inputText}
              onClear={() => {
                setInputText("");
                setSearch("");
              }}
            />
          </Form>
        </Col>

        <Col size={6} className="u-align-text--right">
          <Button type="button" onClick={handlePackageConstraintsChange}>
            Change package constraints
          </Button>
        </Col>
      </Row>

      <ModularTable
        columns={columns}
        data={constraintsData}
        emptyMsg={
          search
            ? `No constraints found with the search: "${search}"`
            : "Package profile has no constraints"
        }
      />
    </>
  );
};

export default PackageProfileDetails;
