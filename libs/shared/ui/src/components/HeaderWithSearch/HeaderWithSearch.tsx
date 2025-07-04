import { Form, SearchBox } from '@canonical/react-components';
import { useFormik } from 'formik';
import type { FC } from 'react';
import { isValidElement } from 'react';
import * as Yup from 'yup';
import classes from './HeaderWithSearch.module.scss';
import type { FormProps, HeaderWithSearchProps } from './types';
import classNames from 'classnames';
import { usePageParams } from '@landscape/hooks';

const HeaderWithSearch: FC<HeaderWithSearchProps> = ({
  actions,
  afterSearch,
  autocomplete,
  onSearch,
  className: customClassName,
  ...inputProps
}) => {
  const { search, setPageParams } = usePageParams();

  const handleSearch = ({ inputText }: { inputText: string }) => {
    if (onSearch) {
      onSearch(inputText.trim());
    } else {
      setPageParams({ search: inputText.trim() });
      if (afterSearch) {
        afterSearch();
      }
    }
  };

  const formik = useFormik<FormProps>({
    initialValues: {
      inputText: search,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      inputText: Yup.string(),
    }),
    onSubmit: handleSearch,
  });

  const handleClear = () => {
    if (onSearch) {
      onSearch('');
    } else {
      setPageParams({ search: '' });
    }
    formik.resetForm();
  };

  const handleChange = async (value: string) => {
    await formik.setFieldValue('inputText', value);
  };

  return (
    <div className={classNames(customClassName, classes.container)}>
      <div className={classes.search}>
        <Form className="u-no-margin--bottom" onSubmit={formik.handleSubmit}>
          <SearchBox
            className="u-no-margin--bottom"
            externallyControlled
            shouldRefocusAfterReset
            autocomplete={autocomplete ?? 'off'}
            onSearch={() => handleSearch(formik.values)}
            value={formik.values.inputText}
            onChange={handleChange}
            onClear={handleClear}
            {...inputProps}
          />
        </Form>
      </div>

      {isValidElement(actions) && (
        <div className={classes.noShrink}>{actions}</div>
      )}
    </div>
  );
};

export default HeaderWithSearch;
