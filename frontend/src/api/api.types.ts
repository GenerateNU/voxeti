// User credentials:
export type UserCredentials = {
  email: string;
  password: string;
};

// Id Response:
export type IdResponse = {
  id: string;
};

// Id Response:
export type IdResponse = {
  id: string;
}

// Google SSO Response:
export type ProviderUser = {
  user: string;
  userType: "new" | "existing";
  provider: "GOOGLE";
};
