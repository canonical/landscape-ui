import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FormikHelpers } from "formik";
import { useFormik } from "formik";
import type { FC } from "react";
import { useState } from "react";
import { usePackageProfiles } from "../../hooks";
import type { Constraint, PackageProfileConstraintType } from "../../types";
import PackageProfileConstraintsEditFormActions from "../PackageProfileConstraintsEditFormActions";
import PackageProfileConstraintsEditFormTable from "../PackageProfileConstraintsEditFormTable";
import type { PackageProfileSidePanelComponentProps } from "../PackageProfileSidePanel";
import PackageProfileSidePanel from "../PackageProfileSidePanel";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import classes from "./PackageProfileConstraintsEditForm.module.scss";

const Component: FC<PackageProfileSidePanelComponentProps> = ({
  packageProfile: profile,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [constraintType, setConstraintType] = useState<
    PackageProfileConstraintType | ""
  >("");

  const handlePageChange = (page: number) => {
    setSelectedIds([]);
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSelectedIds([]);
    setPageSize(newPageSize);
  };

  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();
  const {
    editPackageProfileConstraintQuery,
    getPackageProfileConstraintsQuery,
  } = usePackageProfiles();

  const { mutateAsync: editConstraint } = editPackageProfileConstraintQuery;

  const handleSubmit = async (
    values: Constraint,
    { resetForm }: FormikHelpers<Constraint>,
  ) => {
    try {
      await editConstraint({
        constraint: values.constraint as PackageProfileConstraintType,
        id: values.id,
        package: values.package,
        rule: values.rule,
        version: values.version,
        name: profile.name,
      });

      notify.success({
        message: `"${profile.title}" package profile's constraint updated successfully`,
        title: "Package profile constraint updated",
      });

      resetForm();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  const {
    data: getPackageProfileConstraintsQueryResult,
    isLoading: getPackageProfileConstraintsQueryLoading,
  } = getPackageProfileConstraintsQuery({
    constraint_type: constraintType || undefined,
    limit: pageSize,
    name: profile.name,
    offset: (currentPage - 1) * pageSize,
    search,
  });

  return (
    <>
      <SidePanel.Header>
        Change &quot;{profile.title}&quot; profile&apos;s constraints
      </SidePanel.Header>
      <SidePanel.Content>
        {!search &&
          !constraintType &&
          currentPage === 1 &&
          pageSize === 20 &&
          getPackageProfileConstraintsQueryLoading && <LoadingState />}

        {(search ||
          constraintType ||
          currentPage !== 1 ||
          pageSize !== 20 ||
          (!getPackageProfileConstraintsQueryLoading &&
            getPackageProfileConstraintsQueryResult &&
            getPackageProfileConstraintsQueryResult.data.results.length >
              0)) && (
          <>
            <HeaderWithSearch
              actions={
                <PackageProfileConstraintsEditFormActions
                  filter={constraintType}
                  formik={formik}
                  onFilterChange={(value) => {
                    setConstraintType(value);
                  }}
                  profile={profile}
                  selectedIds={selectedIds}
                  setSelectedIds={(value) => {
                    setSelectedIds(value);
                  }}
                  onOpenAddConstraintsForm={() => {
                    setPageParams({ action: "constraints/add" });
                  }}
                />
              }
              onSearch={(searchText) => {
                setSearch(searchText);
              }}
              disabled={formik.values.id !== 0}
            />

            <PackageProfileConstraintsEditFormTable
              filter={constraintType}
              formik={formik}
              isConstraintsLoading={getPackageProfileConstraintsQueryLoading}
              onSelectedIdsChange={(value) => {
                setSelectedIds(value);
              }}
              pageSize={pageSize}
              profileConstraints={
                getPackageProfileConstraintsQueryResult?.data.results
              }
              search={search}
              selectedIds={selectedIds}
            />

            <SidePanelTablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              paginate={handlePageChange}
              setPageSize={handlePageSizeChange}
              totalItems={getPackageProfileConstraintsQueryResult?.data.count}
              className={classes.pagination}
            />
          </>
        )}
      </SidePanel.Content>
    </>
  );
};

const PackageProfileConstraintsEditForm: FC = () => (
  <PackageProfileSidePanel Component={Component} />
);

export default PackageProfileConstraintsEditForm;
