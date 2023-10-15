import { User } from "../main.types";

export type UserSliceState = {
  csrfToken: string;
  user: User;
}
