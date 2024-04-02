import { FormikHelpers, useFormik } from "formik";
import { FC, useState } from "react";
import { Button } from "@canonical/react-components";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
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
import useSidePanel from "@/hooks/useSidePanel";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import classes from "./PackageProfileConstraintsEditForm.module.scss";

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
  const { closeSidePanel } = useSidePanel();
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
    error: getPackageProfileConstraintsQueryError,
    isLoading: getPackageProfileConstraintsQueryLoading,
  } = getPackageProfileConstraintsQuery({
    name: profile.name,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search,
  });

  if (getPackageProfileConstraintsQueryError) {
    debug(getPackageProfileConstraintsQueryError);
  }

  return (
    <>
      {!search &&
        currentPage === 1 &&
        pageSize === 20 &&
        getPackageProfileConstraintsQueryLoading && <LoadingState />}

      {(search ||
        currentPage !== 1 ||
        pageSize !== 20 ||
        (!getPackageProfileConstraintsQueryLoading &&
          getPackageProfileConstraintsQueryResult &&
          getPackageProfileConstraintsQueryResult.data.results.length > 0)) && (
        <>
          <HeaderWithSearch
            actions={
              <PackageProfileConstraintsEditFormActions
                formik={formik}
                profile={profile}
                selectedIds={selectedIds}
                setSelectedIds={(value) => setSelectedIds(value)}
              />
            }
            onSearch={(searchText) => setSearch(searchText)}
            disabled={formik.values.id !== 0}
          />

          <PackageProfileConstraintsEditFormTable
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

          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            paginate={handlePageChange}
            setPageSize={handlePageSizeChange}
            totalItems={getPackageProfileConstraintsQueryResult?.data.count}
            className={classes.pagination}
          />
        </>
      )}

      <div className="form-buttons">
        <Button
          type="button"
          className="u-no-margin--bottom"
          onClick={() => closeSidePanel()}
        >
          <span>Close</span>
        </Button>
      </div>
    </>
  );
};

export default PackageProfileConstraintsEditForm;
