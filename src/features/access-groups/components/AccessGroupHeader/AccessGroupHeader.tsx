import { PageParamFilter, TableFilterChips } from "@/components/filter";
import { FILTERS } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import { Form, SearchBox } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import classes from "./AccessGroupHeader.module.scss";

interface FormProps {
  searchText: string;
}

const AccessGroupHeader: FC = () => {
  const { search, setPageParams, createPageParamsSetter } = usePageParams();

  const handleClear = createPageParamsSetter({ search: "" });

  const handleSearch = (values: FormProps) => {
    setPageParams({ search: values.searchText });
  };

  const formik = useFormik<FormProps>({
    initialValues: { searchText: search },
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
              onSearch={() => {
                formik.submitForm();
              }}
              onClear={handleClear}
            />
          </Form>
        </div>
        <PageParamFilter
          label="Group by"
          options={groupOptions}
          key="group-by-filter"
          pageParamKey="groupBy"
        />
      </div>
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default AccessGroupHeader;
