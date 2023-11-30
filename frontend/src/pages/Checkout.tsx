import { useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

const Message = (props: { message: string }) => (
    <div className="flex items-center justify-center h-screen">
        {/* <p className="font-medium text-sm leading-5 tracking-tighter text-[#242d60] h-full w-full px-5 flex items-center justify-center box-border">{props.message}</p> */}
        <h1 className="font-medium text-sm leading-5 tracking-tighter text-[#242d60] h-full w-full px-5 flex items-center justify-center box-border">
            {props.message}
        </h1>
    </div>
);

export default function Checkout() {
    const [message, setMessage] = useState("");

    const [clientSecret, setClientSecret] = useState('');
    const base = "http://localhost:3000/api/"

    useEffect(() => {
        // Create a Checkout Session as soon as the page loads
        console.log("Doing the embedded stripe work")
        fetch(base + "payment/create-checkout-session", {
        method: "POST",
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.client_secret));
    }, []);

    const options = {clientSecret};
    console.log(JSON.stringify(options));

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get("success")) {
            setMessage("Order placed! You will receive an email confirmation.");
        }

        if (query.get("canceled")) {
            setMessage(
                "Order canceled -- continue to shop around and checkout when you're ready."
            );
        }
    }, []);

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