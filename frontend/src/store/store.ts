import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import {
  authApi,
  designApi,
  jobApi,
  priceEstimationApi,
  slicerApi,
  userApi,
  paymentApi,
} from "../api/api";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const combinedReducers = combineReducers({
  user: userReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [slicerApi.reducerPath]: slicerApi.reducer,
  [priceEstimationApi.reducerPath]: priceEstimationApi.reducer,
  [designApi.reducerPath]: designApi.reducer,
  [jobApi.reducerPath]: jobApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
});

type RootReducer = ReturnType<typeof combinedReducers>;

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: [
    authApi.reducerPath,
    userApi.reducerPath,
    slicerApi.reducerPath,
    priceEstimationApi.reducerPath,
    designApi.reducerPath,
    jobApi.reducerPath,
    paymentApi.reducerPath,
  ],
};

const persistedReducer = persistReducer<RootReducer>(
  persistConfig,
  combinedReducers,
);

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(slicerApi.middleware)
      .concat(priceEstimationApi.middleware)
      .concat(designApi.middleware)
      .concat(jobApi.middleware)
      .concat(paymentApi.middleware),
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
