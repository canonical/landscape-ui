import { GroupFilter, TableFilterChips } from "@/components/filter";
import { FILTERS } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import classes from "./AccessGroupHeader.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, SearchBox } from "@canonical/react-components";

interface FormProps {
  searchText: string;
}

const AccessGroupHeader: FC = () => {
  const { search, setPageParams } = usePageParams();

  const handleSearch = () => {
    setPageParams({ search: formik.values.searchText });
  };

  const handleClear = () => {
    setPageParams({ search: "" });
  };

  const formik = useFormik<FormProps>({
    initialValues: {
      searchText: search,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      search: Yup.string(),
    }),
    onSubmit: handleSearch,
  });

  const groupOptions =
    FILTERS.groupBy.type === "select" ? FILTERS.groupBy.options : [];

  return (
    <>
      <div className={classes.container}>
        <div className={classes.searchContainer}>
          <Form onSubmit={formik.handleSubmit} noValidate>
            <SearchBox
              autocomplete="off"
              externallyControlled
              value={formik.values.searchText}
              onChange={async (value) =>
                await formik.setFieldValue("searchText", value)
              }
              placeholder="Search"
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </Form>
        </div>
        <GroupFilter
          label="Group by"
          options={groupOptions}
          key="group-by-filter"
        />
      </div>
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default AccessGroupHeader;
