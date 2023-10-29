import { CodeResponse } from "@react-oauth/google";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from "@reduxjs/toolkit/query";
import { UserSliceState } from "../store/store.types";

export interface UseGoogleProps {
  googleSSO: MutationTrigger<
    MutationDefinition<
      string,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        object,
        FetchBaseQueryMeta
      >,
      never,
      UserSliceState,
      "authApi"
    >
  >;
  setProviderLoginPending: React.Dispatch<React.SetStateAction<boolean>>;
  setProviderUser: React.Dispatch<
    React.SetStateAction<UserSliceState | undefined>
  >;
}

export type GoogleSSOResponse = Omit<
  CodeResponse,
  "error" | "error_description" | "error_uri"
> & {
  access_token?: string;
  scope?: string;
};
