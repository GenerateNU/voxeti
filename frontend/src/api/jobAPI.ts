import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Design, Job } from "../main.types";
import { VoxetiJob } from "./api.types";

export const createJobApi = (baseUrl: string) =>
  createApi({
    reducerPath: "jobApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/jobs`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      getJob: builder.mutation<Design[], FormData>({
        query: (jobId) => ({
          method: "GET",
          url: `/${jobId}`,
        }),
      }),
      deleteJob: builder.mutation<Design, string>({
        query: (jobId) => ({
          method: "DELETE",
          url: `/${jobId}`,
        }),
      }),
      createJob: builder.mutation<void, Job>({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
        }),
      }),
      putJob: builder.mutation<void, VoxetiJob>({
        query: ({ id, job }) => ({
          body: job,
          method: "PUT",
          url: `/${id}`,
        }),
      }),
      updateJob: builder.mutation<void, VoxetiJob>({
        query: ({ id, job }) => ({
          body: job,
          method: "PATCH",
          url: `/${id}`,
        }),
      }),
    }),
  });
