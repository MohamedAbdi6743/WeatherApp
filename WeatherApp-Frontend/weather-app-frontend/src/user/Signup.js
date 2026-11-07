import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

import { signUpApi } from "../util/ApiUtil";
import {
  FIRSTNAME_MIN_LENGTH,
  FIRSTNAME_MAX_LENGTH,
  LASTNAME_MIN_LENGTH,
  LASTNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../common/constants";
import AuthLayout, { TextLink } from "../ui/AuthLayout";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import notify from "../ui/notify";

const between = (min, max) => `Use ${min}–${max} characters`;

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(FIRSTNAME_MIN_LENGTH, between(FIRSTNAME_MIN_LENGTH, FIRSTNAME_MAX_LENGTH))
    .max(FIRSTNAME_MAX_LENGTH, between(FIRSTNAME_MIN_LENGTH, FIRSTNAME_MAX_LENGTH))
    .required("Enter your first name"),
  lastName: Yup.string()
    .min(LASTNAME_MIN_LENGTH, between(LASTNAME_MIN_LENGTH, LASTNAME_MAX_LENGTH))
    .max(LASTNAME_MAX_LENGTH, between(LASTNAME_MIN_LENGTH, LASTNAME_MAX_LENGTH))
    .required("Enter your last name"),
  username: Yup.string()
    .min(USERNAME_MIN_LENGTH, between(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH))
    .max(USERNAME_MAX_LENGTH, between(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH))
    .required("Choose a username"),
  phone: Yup.string().required("Enter your phone number"),
  email: Yup.string()
    .email("Enter a valid email address")
    .matches("[^@ ]+@[^@ ]+.[^@ ]+", "Enter a valid email address")
    .max(EMAIL_MAX_LENGTH, `Use at most ${EMAIL_MAX_LENGTH} characters`)
    .required("Enter your email"),
  password: Yup.string()
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*])(?=.{8,})/,
      "Add upper and lower case letters, a number and a symbol (!@#$%&*)"
    )
    .min(PASSWORD_MIN_LENGTH, "Too short")
    .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters`)
    .required("Choose a password"),
});

const CheckInbox = ({ email }) => {
  const navigate = useNavigate();
  return (
  <div className="animate-fade-up">
    <span className="grid h-12 w-12 place-items-center rounded-item bg-accent-soft text-accent">
      <FiMail className="h-6 w-6" aria-hidden="true" />
    </span>
    <h2 className="mt-5 text-xl font-semibold tracking-tight text-ink">Check your inbox</h2>
    <p className="mt-2 text-pretty text-[15px] leading-6 text-ink-muted">
      We sent a verification link to <span className="font-medium text-ink">{email}</span>. Open it
      within 24 hours to activate your account.
    </p>
    <Button size="lg" fullWidth className="mt-7" onClick={() => navigate("/login")}>
      Go to log in
    </Button>
  </div>
  );
};

const Signup = () => {
  const [sentTo, setSentTo] = useState(null);

  const onFormSubmit = async (values) => {
    const apiResponse = await signUpApi(
      values.firstName,
      values.lastName,
      values.username,
      values.phone,
      values.email,
      values.password
    );

    if (apiResponse.status === 1) {
      setSentTo(values.email);
    } else {
      notify.error(apiResponse.payLoad);
    }
  };

  return (
    <AuthLayout
      title={sentTo ? "Almost there" : "Create an account to save up to 8 favourite cities"}
      footer={
        !sentTo && (
          <>
            Already have an account?{" "}
            <TextLink as={Link} to="/login">
              Log in
            </TextLink>
          </>
        )
      }
    >
      {sentTo ? (
        <CheckInbox email={sentTo} />
      ) : (
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            username: "",
            phone: "",
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
        validateOnBlur={false}
          onSubmit={onFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="First name" name="firstName" autoComplete="given-name" autoFocus />
                <TextField label="Last name" name="lastName" autoComplete="family-name" />
              </div>
              <TextField label="Username" name="username" autoComplete="username" />
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
              />
              <TextField label="Phone" name="phone" type="tel" autoComplete="tel" />
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                hint="8+ characters with upper and lower case, a number and a symbol."
              />
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={isSubmitting}
                loadingText="Creating account…"
                className="!mt-7"
              >
                Create account
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </AuthLayout>
  );
};

export default Signup;
