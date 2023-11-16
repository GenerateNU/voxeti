import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Job } from "../main.types";

// Job API:
export const createJobApi = (baseUrl: string) =>
  createApi({
    reducerPath: "jobApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/jobs`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      createJob: builder.mutation<Job, Job>({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
        }),
      }),
      updateJob: builder.mutation<Job, { id: string; body: Job }>({
        query: ({ id, body }) => ({
          body,
          method: "POST",
          url: `/${id}`,
        }),
      }),
      getJob: builder.query<Job, string>({
        query: (id) => `/${id}`,
      }),
      getDesignerJobs: builder.query<
        Job[],
        { designerId: string; page: string }
      >({
        query: ({ designerId, page }) => `?designer=${designerId}&page=${page}`,
      }),
      getProducerJobs: builder.query<
        Job[],
        { producerId: string; page: string }
      >({
        query: ({ producerId, page }) => `?producer=${producerId}&page=${page}`,
      }),
      patchJob: builder.mutation<Job, { id: string; body: Partial<Job> }>({
        query: ({ id, body }) => ({
          body,
          method: "PATCH",
          url: `/${id}`,
        }),
      }),
      deleteJob: builder.mutation<Job, string>({
        query: (id) => ({
          method: "DELETE",
          url: `/${id}`,
        }),
      }),
    }),
  });
