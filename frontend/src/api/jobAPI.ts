import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Design, Job } from "../main.types";
import { RootState } from "../store/store";
import { VoxetiJob } from "./api.types";

export const createJobApi = (baseUrl: string) =>
  createApi({
    reducerPath: "jobApi",
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/jobs`,
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).user.csrfToken
        if (token) {
          headers.set("Csrftoken", token)
        }
        return headers
      }
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
      getDesignerJobs: builder.query<Job[], { designerId: string; page: string }>({
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
    }),
  });
