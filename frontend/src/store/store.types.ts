import { SocialProvider, User } from "../main.types";

export type UserSliceState = {
  csrfToken: string;
  user: User;
}

export type NewSSOUser = {
  email: string;
  socialProvider: SocialProvider;
}
