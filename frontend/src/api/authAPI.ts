import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserCredentials } from './api.types';
import { UserSliceState } from '../store/store.types';

// Auth API:
export const createAuthApi = (baseUrl : string) => (
  createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/auth`,
      credentials: 'include',
    }),
    endpoints: (builder) => ({
      login: builder.mutation<UserSliceState, UserCredentials>({
        query: (body) => ({
          body,
          method: 'POST',
          url: '/login',
        })
      }),
      logout: builder.mutation<void, string>({
        query: (csrfToken) => ({
          body: { csrfToken },
          method: 'POST',
          url: '/logout',
        })
      }),
      googleSSO: builder.mutation<UserSliceState, string>({
        query: (accessToken) => ({
          body: { accessToken },
          method: 'POST',
          url: '/google-provider',
        })
      })
    }),
  })
)
