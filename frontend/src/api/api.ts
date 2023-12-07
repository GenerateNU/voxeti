import { createAuthApi } from "./authAPI";
import { createDesignApi } from "./designAPI";
import { createJobApi } from "./jobAPI";
import { createPaymentApi } from "./paymentAPI";
import { createPriceEstimationApi, createSlicerApi } from "./slicerAPI";
import { createUserApi } from "./userAPI";

const API_BASE_URL = "http://localhost:3000/api";
const MICRO_SERVICE_URL = "http://44.215.25.156:3000/api"

const authApi = createAuthApi(API_BASE_URL);
const userApi = createUserApi(API_BASE_URL);
const slicerApi = createSlicerApi(MICRO_SERVICE_URL);
const priceEstimationApi = createPriceEstimationApi(API_BASE_URL);
const designApi = createDesignApi(API_BASE_URL);
const jobApi = createJobApi(API_BASE_URL);
const paymentApi = createPaymentApi(API_BASE_URL);

export {
  authApi,
  userApi,
  slicerApi,
  priceEstimationApi,
  designApi,
  jobApi,
  paymentApi,
};
