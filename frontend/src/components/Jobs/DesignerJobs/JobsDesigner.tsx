import {
  Paper,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { jobApi } from "../../../api/api";
import { useStateDispatch, useStateSelector } from "../../../hooks/use-redux";
import { Job, PageStatus } from "../../../main.types";
import { resetUser } from "../../../store/userSlice";
import FilterDropDown from "../FilterDropDown";
import TableHeader from "../TableHeader";
import JobRow, { JobExtended } from "../JobRow";
import ErrorImage from "../../../assets/hero-image-2.png";

export default function JobsDesigner() {
  // State setters:
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsInView, setJobsInView] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>("PENDING");
  const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.Loading);

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);

    const tempJobs = jobs;
    const filteredJobs = tempJobs.filter(
      (job) => job.status === event.target.value,
    );
    setJobsInView(filteredJobs);
  };

  // Redux:
  const { user } = useStateSelector((state) => state.user);
  const dispatch = useStateDispatch();

  // API Requests:
  const jobsResponse = jobApi.useGetDesignerJobsQuery({
    designerId: user.id,
    page: "0",
  });

  useEffect(() => {
    if (jobsResponse.isSuccess) {
      setJobs(jobsResponse.data);
      const filteredJobs = jobsResponse.data.filter(
        (job) => job.status === filter,
      );
      setJobsInView(filteredJobs);
      setPageStatus(PageStatus.Success);
    } else if (jobsResponse.error) {
      if ("status" in jobsResponse.error && jobsResponse.error.status == 401) {
        dispatch(resetUser());
      }
      setPageStatus(PageStatus.Error);
    }
  }, [
    dispatch,
    filter,
    jobsResponse.data,
    jobsResponse.error,
    jobsResponse.isSuccess,
  ]);

  // Designer Filters:
  const filterOptions = [
    {
      title: "Pending",
      value: "PENDING",
    },
    {
      title: "Accepted",
      value: "ACCEPTED",
    },
    {
      title: "In Production",
      value: "INPROGRESS",
    },
    {
      title: "Shipped",
      value: "INSHIPPING",
    },
    {
      title: "Delivered",
      value: "COMPLETE",
    },
  ];

  return (
    <div className="py-32 w-full h-screen flex flex-col items-center">
      <div className=" px-4 w-full sm:w-3/5 flex flex-col">
        <h2 className="text-3xl py-5">Job Submissions</h2>
        <FilterDropDown
          options={filterOptions}
          onChange={handleChange}
          value={filter}
        />
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", marginTop: "40px" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ fontSize: "200px" }}>
                <TableHeader title={"Producer"} />
                <TableHeader title={"File Count"} />
                <TableHeader title={"Price (USD)"} />
                <TableHeader title={"Date Created"} />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {jobsInView.map((job) => (
                <JobRow job={job as JobExtended} type="producer" />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {(jobsInView.length === 0 || pageStatus === PageStatus.Error) && (
          <div className="mt-16 self-center flex flex-col items-center">
            <img className="w-64" src={ErrorImage} />
            <h1 className="mt-10 text-xl">
              {`No ${filterOptions
                .filter((x) => x.value === filter)[0]
                .title.toLowerCase()} jobs...`}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
