// User credentials:
export type UserCredentials = {
  email: string;
  password: string;
};

// Google SSO Response:
export type ProviderUser = {
  user: string;
  userType: "new" | "existing";
  provider: "GOOGLE";
};
