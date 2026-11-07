import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../common/constants";
import { loginApi } from "../util/ApiUtil";
import { AppContext } from "../Context/applicationContext";
import AuthLayout, { TextLink } from "../ui/AuthLayout";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import notify from "../ui/notify";

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(USERNAME_MIN_LENGTH, `Use at least ${USERNAME_MIN_LENGTH} characters`)
    .max(USERNAME_MAX_LENGTH, `Use at most ${USERNAME_MAX_LENGTH} characters`)
    .required("Enter your username"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Passwords have 8+ characters with upper and lower case, a number and a symbol"
    )
    .min(PASSWORD_MIN_LENGTH, "Too short")
    .max(PASSWORD_MAX_LENGTH, "Too long")
    .required("Enter your password"),
});

const Login = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  // Already logged in: skip the login form
  if (appContext.getSession()) {
    return <Navigate to="/home" replace />;
  }

  const onFormSubmit = async (values, actions) => {
    const apiResponse = await loginApi(values.username, values.password);

    if (apiResponse.status === 1) {
      appContext.setSession(apiResponse.payLoad);
      notify.success(`Welcome back, ${apiResponse.payLoad.username}`);
      navigate("/home", { replace: true });
    } else {
      actions.setFieldValue("password", "", false);
      notify.error(apiResponse.payLoad);
    }
  };

  return (
    <AuthLayout
      title="Log in to check the weather in your saved cities"
      footer={
        <>
          New here?{" "}
          <TextLink as={Link} to="/signup">
            Create an account
          </TextLink>
        </>
      }
    >
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        validateOnBlur={false}
        onSubmit={onFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form noValidate className="space-y-5">
            <TextField label="Username" name="username" autoComplete="username" autoFocus />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              labelAction={
                <TextLink as={Link} to="/resetEmailLink" className="text-[13px]">
                  Forgot password?
                </TextLink>
              }
            />
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isSubmitting}
              loadingText="Logging in…"
              className="!mt-7"
            >
              Log in
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Login;
