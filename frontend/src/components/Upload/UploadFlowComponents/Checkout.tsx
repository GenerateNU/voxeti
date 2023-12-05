import { useState, useEffect, useRef } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Setters, States } from "../upload.types";
import { paymentApi } from "../../../api/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

export interface CheckoutProps {
  states: States;
  setters: Setters;
}

export default function Checkout({states, setters}: CheckoutProps) {
    const [clientSecret, setClientSecret] = useState('');
    const [createCheckoutSession] = paymentApi.useCreatePaymentMutation();
    const hasBeenEvaluated = useRef(false);
    // const base = "http://localhost:3000/api/"
    
    useEffect(() => {
        // Create a Checkout Session as soon as the page loads
        // console.log("Doing the embedded stripe work")
        // fetch(base + "payment/create-checkout-session", {
        // method: "POST",
        // body: JSON.stringify({ prices: states.prices, quantities: states.quantities }),
        // })
        // .then((res) => res.json())
        // .then((data) => setClientSecret(data.client_secret));
        async function makeCheckoutSession() {
            if (!states.prices || !states.quantities || clientSecret !== '') {
                return;
            }
            const response = await createCheckoutSession({
                prices: states.prices,
                quantities: states.quantities,
            }).unwrap();
            console.log(`response: ${JSON.stringify(response)}`)
            setClientSecret(response.client_secret)
            hasBeenEvaluated.current = true;
        }
        if (!hasBeenEvaluated.current) {makeCheckoutSession();}
    }, []);

    const handleComplete = () => {
        setters.currentStep(states.currentStep + 1);
    }

    const options = {
        clientSecret,
        onComplete: handleComplete,
    };
    console.log(JSON.stringify(options));

    return (
        <div className="mt-32">
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