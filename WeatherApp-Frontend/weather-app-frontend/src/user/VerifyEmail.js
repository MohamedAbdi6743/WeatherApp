import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import { verifyEmailApi } from "../util/ApiUtil";
import AuthLayout from "../ui/AuthLayout";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import notify from "../ui/notify";

const emailVerificationSchema = Yup.object().shape({
  verificationCode: Yup.string().trim().required("Paste the code from your email"),
});

const VerifyEmail = () => {
  const { verificationCode } = useParams();
  const navigate = useNavigate();

  const onFormSubmit = async (values) => {
    const apiResponse = await verifyEmailApi(values.verificationCode.trim());
    if (apiResponse.status === 1) {
      notify.success("Email verified. You can log in now.");
      navigate("/login", { replace: true });
    } else {
      notify.error(apiResponse.payLoad);
    }
  };

  return (
    <AuthLayout
      title="Verify your email to finish signing up"
      subtitle="We filled in the code from your email link. Codes expire 24 hours after you sign up."
    >
      <Formik
        initialValues={{ verificationCode: verificationCode || "" }}
        validationSchema={emailVerificationSchema}
        validateOnBlur={false}
        onSubmit={onFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form noValidate className="space-y-5">
            <TextField
              label="Verification code"
              name="verificationCode"
              mono
              spellCheck={false}
              autoComplete="one-time-code"
            />
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isSubmitting}
              loadingText="Verifying…"
              className="!mt-7"
            >
              Verify email
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default VerifyEmail;
