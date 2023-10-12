import { User } from "../index.types";

export type UserSliceState = {
  csrfToken: string;
  user: User;
}
