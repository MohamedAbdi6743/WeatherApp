import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";

import { EMAIL_MAX_LENGTH } from "../common/constants";
import { resetEmailLinkApi } from "../util/ApiUtil";
import AuthLayout, { TextLink } from "../ui/AuthLayout";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import notify from "../ui/notify";

const ResetEmailSchema = Yup.object().shape({
  email: Yup.string()
    .required("Enter your email")
    .email("Enter a valid email address")
    .matches("[^@ ]+@[^@ ]+.[^@ ]+", "Enter a valid email address")
    .max(EMAIL_MAX_LENGTH, `Use at most ${EMAIL_MAX_LENGTH} characters`),
});

const ResetEmailLink = () => {
  const [sentTo, setSentTo] = useState(null);

  const onFormSubmit = async (values) => {
    const apiResponse = await resetEmailLinkApi(values.email);
    if (apiResponse.status === 1) {
      setSentTo(values.email);
    } else {
      notify.error(apiResponse.payLoad);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        !sentTo && "Enter the email you signed up with and we'll send you a link to choose a new password."
      }
      footer={
        <>
          Remembered it?{" "}
          <TextLink as={Link} to="/login">
            Back to log in
          </TextLink>
        </>
      }
    >
      {sentTo ? (
        <div className="animate-fade-up rounded-card border border-line bg-surface p-5">
          <span className="grid h-10 w-10 place-items-center rounded-item bg-accent-soft text-accent">
            <FiMail className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-pretty text-[15px] leading-6 text-ink-muted">
            If an account uses <span className="font-medium text-ink">{sentTo}</span>, a reset link
            is on its way. It expires in 24 hours.
          </p>
        </div>
      ) : (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ResetEmailSchema}
          validateOnBlur={false}
          onSubmit={onFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="space-y-5">
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                autoFocus
              />
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={isSubmitting}
                loadingText="Sending link…"
                className="!mt-7"
              >
                Send reset link
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </AuthLayout>
  );
};

export default ResetEmailLink;
