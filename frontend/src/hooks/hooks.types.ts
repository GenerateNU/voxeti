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
import { Error } from "../main.types";
import { ReactNode } from "react";

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

export type BackendErrorData = {
  error: Error,
}

export type BackendError = {
  status: number,
  data: BackendErrorData,
}

export type ErrorContext = {
  error: string,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  addError: (message : string) => void,
  removeError: () => void,
}

export type ApiErrorContextProps = {
  children: ReactNode,
}