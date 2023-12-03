import {
  Paper,
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
import JobRow from "../JobRow";

export default function JobsDesigner() {
  // State setters:
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>('PENDING');
  const [pageStatus, setPageStatus] = useState<PageStatus>(
    PageStatus.Loading
  );

  console.log(pageStatus);

  // Redux:
  const { user } = useStateSelector((state) => state.user);
  const dispatch = useStateDispatch();

  // API Requests:
  const { data, error, isSuccess } = jobApi.useGetDesignerJobsFilteredQuery({
    designerId: user.id,
    status: filter,
    page: "0",
  });

  useEffect(() => {
    if (isSuccess) {
      setJobs(data);
      setPageStatus(PageStatus.Success);
    } else if (error) {
      if ("status" in error && error.status == 401) {
        dispatch(resetUser());
      }
      setPageStatus(PageStatus.Error);
    }
  }, [data, dispatch, error, isSuccess]);

  // Designer Filters:
  const filterOptions = [
    {
      title: "Pending",
      value: "PENDING"
    },
    {
      title: "Accepted",
      value: "ACCEPTED"
    },
    {
      title: "In Production",
      value: "INPROGRESS"
    },
    {
      title: "Shipped",
      value: "INSHIPPING"
    },
    {
      title: "Delivered",
      value: "COMPLETE"
    },
  ]

  return (
    <div className="py-32 w-full h-screen flex flex-col items-center">
      <div className=" px-4 w-full sm:w-3/5">
        <h2 className="text-3xl py-5">Job Submissions</h2>
        <FilterDropDown 
          options={filterOptions}
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        />
        <TableContainer component={Paper} sx={{boxShadow: 'none', marginTop: '40px'}}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ fontSize: '200px'}}>
                <TableHeader title={'Producer'} />
                <TableHeader title={'File Count'} />
                <TableHeader title={'Price (USD)'} />
                <TableHeader title={'Status'} />
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) =>
                <JobRow job={job} type='producer' />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
