import React from 'react';
import styled from 'styled-components';
import { Field, FieldAttributes, Form, Formik } from 'formik';

const SearchField = styled.div`
  width: 92%;
  text-align: center;
`;

const SearchIcon = styled.span`
  position: absolute !important;
  left: 14px !important;
  top: 20px !important;
  font-size: 12px;
  color: #637792 !important;
`;

const inputStyles = {
  backgroundColor: '#F2F2F2',
  borderRadius: '12px',
  padding: '8px 20px 8px 32px',
  border: 'none',
  width: '100%',
  height: '56px',
  fontSize: '16px',
};

const UserSearchBar = ({ onSearch, placeholder }) => {
  const onSubmit = (values) => {
    onSearch(values.query);
  };

  return (
    <Formik initialValues={{ query: '' }} onSubmit={onSubmit}>
      <Form>
        <SearchField>
          <p className="control has-icons-left has-icons-right">
            <Field
              name="query"
              style={inputStyles}
              type="text"
              placeholder={placeholder}
              className="form-field"
            />
            <SearchIcon className="is-small is-left">
              <i className="fas fa-search"></i>
            </SearchIcon>
          </p>
        </SearchField>
      </Form>
    </Formik>
  );
};

export default UserSearchBar;
