import { createAuthApi } from "./authAPI"
import { createUserApi } from "./userAPI";

const API_BASE_URL = 'http://localhost:3000/api'

const authApi = createAuthApi(API_BASE_URL);
const userApi = createUserApi(API_BASE_URL);

export { authApi, userApi }
