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
    
    useEffect(() => {
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