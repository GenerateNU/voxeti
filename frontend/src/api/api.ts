import { createAuthApi } from "./authAPI"

const API_BASE_URL = 'http://localhost:3000/api'

const authApi = createAuthApi(API_BASE_URL);

export { authApi }