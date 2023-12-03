import { useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Setters, States } from "../upload.types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

export interface CheckoutProps {
  states: States;
  setters: Setters;
}

export default function Checkout({states, setters}: CheckoutProps) {
    const [clientSecret, setClientSecret] = useState('');
    const base = "http://localhost:3000/api/"

    useEffect(() => {
        // Create a Checkout Session as soon as the page loads
        console.log("Doing the embedded stripe work")
        fetch(base + "payment/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ prices: states.prices, quantities: states.quantities }),
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.client_secret));
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
            {/*message ? <Message message={message} /> : <ProductDisplay /> */}
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