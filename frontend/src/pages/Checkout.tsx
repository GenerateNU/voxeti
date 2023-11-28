import { useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_123');

const ProductDisplay = () => {
    const handleSubmit = async () => {
        const response = await fetch("http://localhost:3000/api/payment/checkout-session", {
            method: "POST",
        });
        const session: string = await response.json();
        window.location.href = session;

        // const session = await response.json();
        // // const result = await stripe.redirectToCheckout({
        // //     sessionId: session.id,
        // // });
        // // if (result.error) {
        // //     // If `redirectToCheckout` fails due to a browser or network
        // //     // error, display the localized error message to your customer
        // //     // using `result.error.message`.
        // // }
    }
    return (
        <div className="flex justify-center items-center bg-[#ffffff] font-sans h-screen m-0 antialiased text-gray-900">
            <div className="bg-white flex flex-col w-[400px] h-[112px] rounded-md justify-between">
                <div className="flex">
                    <img
                        src="https://media.istockphoto.com/id/1269868014/photo/3d-printer-printing-prototypes.jpg?s=612x612&w=0&k=20&c=FEJ5oGATwYZKfly52NRWZx2GqeuoD1FIFIgGSwmirt0="
                        alt="Printing Job"
                        className="rounded-md m-2.5 w-14 h-14"
                    />
                    <div className="flex flex-col justify-center">
                        <h3 className="font-medium text-sm leading-5 tracking-tighter text-[#242d60] m-0">Printing Job</h3>
                        <h5 className="font-medium text-sm leading-5 tracking-tighter text-[#242d60] m-0 opacity-50">$20.00</h5>
                    </div>
                </div>
                <button onClick={handleSubmit} className="h-9 bg-[#556cd6] text-white w-full text-sm border-0 font-medium cursor-pointer tracking-wider rounded-b-md transition-all duration-200 ease-in-out shadow-md hover:opacity-80">
                    Checkout
                </button>
            </div>
        </div>
    )
};

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

    useEffect(() => {
        // Create a Checkout Session as soon as the page loads
        fetch("/create-checkout-session", {
        method: "POST",
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const options = {clientSecret};

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
        <div>
            {message ? <Message message={message} /> : <ProductDisplay />}
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