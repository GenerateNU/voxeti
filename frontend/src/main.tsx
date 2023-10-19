import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import router from "./router.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <GoogleOAuthProvider clientId={googleClientId}>
      <React.StrictMode>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <RouterProvider router={router} />
          </PersistGate>
        </Provider>
      </React.StrictMode>
    </GoogleOAuthProvider>,
  );
}
