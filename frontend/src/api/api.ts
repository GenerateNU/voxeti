import { createAuthApi } from "./authAPI";
import { createUserApi } from "./userAPI";
import { createJobApi } from "./jobAPI";
import { createDesignApi } from "./designAPI";

const API_BASE_URL = "http://localhost:3000/api";

const authApi = createAuthApi(API_BASE_URL);
const userApi = createUserApi(API_BASE_URL);
const jobApi = createJobApi(API_BASE_URL);
const designApi = createDesignApi(API_BASE_URL);

export { authApi, userApi, jobApi, designApi };
