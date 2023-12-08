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
        const token = (getState() as RootState).user.csrfToken;
        if (token) {
          headers.set("Csrftoken", token);
        }
        return headers;
      },
    }),
    endpoints: (builder) => ({
      getJob: builder.mutation<Job, string>({
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
      acceptJob: builder.mutation<void, { id: string; producerId: string }>({
        query: ({ id, producerId }) => ({
          method: "PUT",
          url: `/accept/${id}?producer=${producerId}`,
        }),
      }),
      declineJob: builder.mutation<void, { id: string; producerId: string }>({
        query: ({ id, producerId }) => ({
          method: "PUT",
          url: `/decline/${id}?producer=${producerId}`,
        }),
      }),
      getDesignerJobs: builder.query<
        Job[],
        { designerId: string; page: string }
      >({
        query: ({ designerId, page }) => `?designer=${designerId}&page=${page}`,
      }),
      getDesignerJobsFiltered: builder.query<
        Job[],
        { designerId: string; status: string; page: string }
      >({
        query: ({ designerId, status, page }) =>
          `?designer=${designerId}&status=${status}&page=${page}`,
      }),
      getProducerJobs: builder.query<
        Job[],
        { producerId: string; page: string }
      >({
        query: ({ producerId, page }) => `?producer=${producerId}&page=${page}`,
      }),
      getProducerJobsFiltered: builder.query<
        Job[],
        { producerId: string; status: string; page: string }
      >({
        query: ({ producerId, status, page }) =>
          `?producer=${producerId}&status=${status}&page=${page}`,
      }),

      getRecommendations: builder.query<
        Job[],
        {
          producerId: string;
          page: string;
          limit: string;
          filter: string[];
          sort: string;
        }
      >({
        query: ({ producerId, page, limit, filter, sort }) =>
          `/recommendations/${producerId}?page=${page}&limit=${limit}&filter=${filter.join(
            ",",
          )}&sort=${sort}`,
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
