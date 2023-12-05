import { User } from "../main.types";

export type UserSliceState = {
  csrfToken: string;
  ssoAccessToken?: string;
  user: User;
};
