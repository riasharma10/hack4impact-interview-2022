import { useContext } from 'react';
import { Formik, Form } from 'formik';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../context';
import FormField from '../../components/FormField';

import styled, { createGlobalStyle } from 'styled-components';

const Container = styled.div`
  background-color: #edf0f1;
  border-radius: 20px;
  padding: 60px;
  max-width: 700px !important;
  top: 100px;
`;

const Divider = styled.hr`
  color: black;
  background-color: rgba(150, 150, 150, 1);
  width: 40%;
  margin: 20px auto;
`;

const SubmitButton = styled.button`
  width: 70%;
  font-family: 'Montserrat';
  font-weight: 700;
  background-color: #202f8e !important;
  border-radius: 10px;
  margin: 0 auto;
  display: block;
`;

const StyledHeader = styled.h1`
  text-align: center;
  margin: 0 !important;
  font-family: Montserrat;
  font-weight: 700;
`;

const IconContainer = styled.span`
  color: #969696 !important;
`;

const StyledField = styled.div`
  margin: 20px auto !important;
  width: 70%;
`;

const inputStyles = {
  backgroundColor: 'white',
  color: 'rgba(150, 150, 150, 1)',
  borderRadius: '5px',
  padding: '10px 20px 8px 36px',
  border: 'none',
  width: '100%',
  fontFamily: 'Montserrat',
};

const GlobalStyle = createGlobalStyle`
  ::placeholder {
    color: rgba(150, 150, 150, 1) !important;
  }
`;

const FieldWrapper = ({ children, icon }) => {
  if (!icon) return children;

  return (
    <StyledField className="field">
      <p className="control has-icons-left has-icons-right">
        {children}
        <IconContainer className="icon is-small is-left">
          <i className={`fas ${icon}`}></i>
        </IconContainer>
      </p>
    </StyledField>
  );
};

function LoginPage() {
  const auth = useContext(AuthContext);

  if (auth.isAuthenticated) {
    return <Redirect to="/" />;
  }

  async function handleSubmit({ email, password }, actions) {
    try {
      await auth.login(email, password);
    } catch (error) {
      const message =
        error.response.status === 400
          ? error.response.data.message
          : 'An unknown error occurred.';
      actions.setFieldError('password', message);
    }
  }

  return (
    <Container className="container">
      <GlobalStyle></GlobalStyle>
      <StyledHeader className="title mt-4">H4I Dashboard</StyledHeader>
      <Divider></Divider>
      {/* 
      TASK 1
      */}
      <Formik initialValues={{ email: '', password: '' }}>
        {({ errors, isSubmitting }) => (
          <Form>
            <FieldWrapper icon="fa-user">
              <FormField
                name="email"
                type="email"
                placeholder="Username"
                errors={errors}
                style={inputStyles}
              />
            </FieldWrapper>
            <FieldWrapper icon="fa-lock">
              <FormField
                name="password"
                type="password"
                placeholder="Password"
                errors={errors}
                style={inputStyles}
              />
            </FieldWrapper>
            <SubmitButton
              type="submit"
              className="button is-link"
              disabled={isSubmitting}
            >
              Log In
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default LoginPage;
