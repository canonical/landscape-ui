import { FormikHelpers, useFormik } from "formik";
import { FC, useState } from "react";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import PackageProfileConstraintsEditFormActions from "@/features/package-profiles/PackageProfileConstraintsEditFormActions";
import PackageProfileConstraintsEditFormTable from "@/features/package-profiles/PackageProfileConstraintsEditFormTable";
import { usePackageProfiles } from "@/features/package-profiles/hooks";
import {
  Constraint,
  PackageProfile,
  PackageProfileConstraintType,
} from "@/features/package-profiles/types";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import classes from "./PackageProfileConstraintsEditForm.module.scss";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";

interface PackageProfileConstraintsEditFormProps {
  profile: PackageProfile;
}

const PackageProfileConstraintsEditForm: FC<
  PackageProfileConstraintsEditFormProps
> = ({ profile }) => {
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

  const handlePageSizeChange = (pageSize: number) => {
    setSelectedIds([]);
    setPageSize(pageSize);
  };

  const debug = useDebug();
  const { notify } = useNotify();
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
        message: `"${profile.name}" package profile's constraint updated successfully`,
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
          getPackageProfileConstraintsQueryResult.data.results.length > 0)) && (
        <>
          <HeaderWithSearch
            actions={
              <PackageProfileConstraintsEditFormActions
                filter={constraintType}
                formik={formik}
                onFilterChange={(value) => setConstraintType(value)}
                profile={profile}
                selectedIds={selectedIds}
                setSelectedIds={(value) => setSelectedIds(value)}
              />
            }
            onSearch={(searchText) => setSearch(searchText)}
            disabled={formik.values.id !== 0}
          />

          <PackageProfileConstraintsEditFormTable
            filter={constraintType}
            formik={formik}
            isConstraintsLoading={getPackageProfileConstraintsQueryLoading}
            onSelectedIdsChange={(value) => setSelectedIds(value)}
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
    </>
  );
};

export default PackageProfileConstraintsEditForm;
