import { TableFilterChips } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import { Form, SearchBox } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import DaysFilter from "../DaysFilter";
import classes from "./EventsLogHeader.module.scss";

interface FormProps {
  searchText: string;
}

const EventsLogHeader: FC = () => {
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
        <DaysFilter />
      </div>
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default EventsLogHeader;
