import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";

import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "../common/constants";
import { resetPasswordApi } from "../util/ApiUtil";
import AuthLayout, { TextLink } from "../ui/AuthLayout";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import notify from "../ui/notify";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Add upper and lower case letters, a number and a symbol (!@#$%^&*)"
    )
    .min(PASSWORD_MIN_LENGTH, "Too short")
    .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters`)
    .required("Choose a new password"),
  confirmPassword: Yup.string()
    .required("Type the new password again")
    .oneOf([Yup.ref("password"), null], "Passwords don't match"),
});

const ResetPassword = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  const onFormSubmit = async (values) => {
    const apiResponse = await resetPasswordApi(verificationToken, values.password);
    if (apiResponse.status === 1) {
      notify.success("Password updated. Log in with your new password.");
      navigate("/login", { replace: true });
    } else {
      notify.error(apiResponse.payLoad);
    }
  };

  return (
    <AuthLayout
      title="Choose a new password"
      footer={
        <>
          Changed your mind?{" "}
          <TextLink as={Link} to="/login">
            Back to log in
          </TextLink>
        </>
      }
    >
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={ResetPasswordSchema}
        validateOnBlur={false}
        onSubmit={onFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form noValidate className="space-y-5">
            <TextField
              label="New password"
              name="password"
              type="password"
              autoComplete="new-password"
              hint="8+ characters with upper and lower case, a number and a symbol."
              autoFocus
            />
            <TextField
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
            />
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isSubmitting}
              loadingText="Updating password…"
              className="!mt-7"
            >
              Update password
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default ResetPassword;
