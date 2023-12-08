import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Setters, States } from "../upload.types";
import { paymentApi } from "../../../api/api";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
);

export interface CheckoutProps {
  states: States;
  setters: Setters;
}

export default function Checkout({ states, setters }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [createCheckoutSession] = paymentApi.useCreatePaymentMutation();
  const hasBeenEvaluated = useRef(false);

  useEffect(() => {
    async function makeCheckoutSession() {
      if (!states.prices || !states.quantities || clientSecret !== "") {
        return;
      }
      const response = await createCheckoutSession({
        prices: states.prices,
        quantities: states.quantities,
      }).unwrap();
      setClientSecret(response.client_secret);
      hasBeenEvaluated.current = true;
    }
    if (!hasBeenEvaluated.current) {
      makeCheckoutSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComplete = () => {
    // setters.currentStep(states.currentStep + 1);
    setters.formSubmit();
  };

  const options = {
    clientSecret,
    onComplete: handleComplete,
  };

    return (
        <div className="">
            <div id="checkout">
                {clientSecret && (
                    <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={options}
                        >
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                )}
            </div>
        </div>
    )
}
