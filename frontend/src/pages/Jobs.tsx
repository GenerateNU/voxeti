import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { jobApi } from "../api/api";
import { useStateDispatch, useStateSelector } from "../hooks/use-redux";
import { Job } from "../main.types";
import { useState } from "react";
import ProducerCell from "../components/OrderStatus/ProducerCell";
import StatusCell from "../components/OrderStatus/StatusCell";
import FileCell from "../components/OrderStatus/FileCell";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Auth from "../components/Auth/Auth";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useStateSelector((state) => state.user);
  const dispatch = useStateDispatch();

  const { data: data, error } = jobApi.useGetDesignerJobsQuery({
    designerId: user.id,
    page: "0",
  });
  if (data && jobs.length == 0) {
    setJobs(data)
  }

  if (error && 'status' in error && error.status == 401) {
    dispatch(resetUser());
  }

  return (
    <Auth authRoute={true}>
      <div className="flex flex-col justify-center items-center w-[50%] mx-auto mt-16">
        <div className="text-left w-full pt-10 pb-5 mt-8">
          <h1 className="text-4xl font-bold py-5">Job Submissions</h1>
        </div>
        <div className="text-left w-full pb-10">
          Approved Jobs
          <ArrowDropDownIcon />
        </div>
        {jobs.length > 0 ? (
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Producer</TableCell>
                  <TableCell align="left">File Name</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow>
                    <TableCell className="w-1/3" align="left">
                      <ProducerCell job={job} />
                    </TableCell>
                    <TableCell className="w-1/3" align="left">
                      <FileCell job={job} />
                    </TableCell>
                    <TableCell className="w-1/3" align="left">
                      <StatusCell job={job} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No jobs {user.id}</p>
        )}
      </div>
    </Auth>
  );
}
