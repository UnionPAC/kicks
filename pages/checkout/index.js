import { Box, Button, Stepper, Step, StepLabel } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import Shipping from "@/components/checkout/Shipping";
import Payment from "@/components/checkout/Payment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { STRAPI_URL } from "@/constants";

const getStripePromise = async () => {
  const pkTestString = process.env.NEXT_PUBLIC_STRIPE_TEST_PUB_KEY.toString();
  const stripePromise = loadStripe(pkTestString);
  return await stripePromise;
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const isFirstStep = activeStep === 0;
  const isSecondStep = activeStep === 1;
  const cart = useSelector((state) => state.cart.cart);

  const handleFormSubmit = (values, actions) => {
    setActiveStep(activeStep + 1);

    // copies billing info onto shipping info
    if (isFirstStep && values.shippingInfo.isSameAddress) {
      actions.setFieldValue("shippingInfo", {
        ...values.billingInfo,
        isSameAddress: true,
      });
    }

    if (isSecondStep) {
      makePayment(values);
    }

    // resets touched value back to not touched
    actions.setTouched({});
  };

  const makePayment = async (values) => {
    const stripe = await getStripePromise();

    const requestBody = {
      data: {
        userName: [
          values.billingInfo.firstName,
          values.billingInfo.lastName,
        ].join(" "),
        email: values.email,
        products: cart.map(({ id, count }) => ({
          id,
          count,
        })),
      },
    };

    const res = await fetch(`https://upbeat-confidence-86d169b626.strapiapp.com/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();
    console.log(data);
    // await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <Box width="80%" margin="130px auto">
      <Stepper activeStep={activeStep} sx={{ margin: "20px 0" }}>
        <Step>
          <StepLabel>Billing</StepLabel>
        </Step>
        <Step>
          <StepLabel>Payment</StepLabel>
        </Step>
      </Stepper>
      <Box>
        <Formik
          validationSchema={checkoutSchema[activeStep]}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              {/* FIRST STEP */}
              {isFirstStep && (
                <Shipping
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              {/* SECOND STEP */}
              {isSecondStep && (
                <Payment
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                />
              )}
              {/* BUTTONS */}
              <Box
                display="flex"
                justifyContent="space-between"
                gap="50px"
                marginBottom={`${isSecondStep ? "331px" : "165px"}`}
              >
                {/* SHOW BACK BUTTON AT STEP 2 */}
                {!isFirstStep && (
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    sx={{
                      backgroundColor: "#333",
                      boxShadow: "none",
                      color: "white",
                      borderRadius: 0,
                      padding: "15px 40px",
                    }}
                    onClick={() => setActiveStep(activeStep - 1)}
                  >
                    Back
                  </Button>
                )}
                {/* FIRST STEP: NEXT BTN, SECOND STEP: PLACE ORDER BTN */}
                <Button
                  fullWidth
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{
                    backgroundColor: "#333",
                    boxShadow: "none",
                    color: "white",
                    borderRadius: 0,
                    padding: "15px 40px",
                  }}
                >
                  {!isSecondStep ? "Next" : "Place Order"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const initialValues = {
  billingInfo: {
    firstName: "",
    lastName: "",
    country: "",
    street1: "",
    street2: "",
    city: "",
    province: "",
    postalCode: "",
  },
  shippingInfo: {
    isSameAddress: true,
    firstName: "",
    lastName: "",
    country: "",
    street1: "",
    street2: "",
    city: "",
    province: "",
    postalCode: "",
  },
  email: "",
  phoneNum: "",
};

const checkoutSchema = [
  yup.object().shape({
    billingInfo: yup.object().shape({
      firstName: yup.string().required("required"),
      lastName: yup.string().required("required"),
      country: yup.string().required("required"),
      street1: yup.string().required("required"),
      street2: yup.string(),
      city: yup.string().required("required"),
      province: yup.string().required("required"),
      postalCode: yup.string().required("required"),
    }),
    shippingInfo: yup.object().shape({
      isSameAddress: yup.boolean(),
      firstName: yup.string().when("isSameAddress", {
        is: false,
        then: () => yup.string().required("required"),
      }),
      lastName: yup.string().when("isSameAddress", {
        is: false,
        then: () => yup.string().required("required"),
      }),
      country: yup.string().when("isSameAddress", {
        is: false,
        then: () => yup.string().required("required"),
      }),
      street1: yup.string().when("isSameAddress", {
        is: false,
        then: () => yup.string().required("required"),
      }),
      street2: yup.string(),
      city: yup.string().when("isSameAddress", {
        is: false,
        then: () => yup.string().required("required"),
      }),
      province: yup.string().when("isSameAddress", {
        is: false,
        then: () => yup.string().required("required"),
      }),
      postalCode: yup.string().when("isSameAddress", {
        is: false,
        then: () => yup.string().required("required"),
      }),
    }),
  }),
  // email and phone number validation
  yup.object().shape({
    email: yup.string().required("required"),
    phoneNum: yup.string().required("required"),
  }),
];

export default Checkout;
