import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { jobApi } from "../../../api/api";
import { useStateDispatch, useStateSelector } from "../../../hooks/use-redux";
import { Job } from "../../../main.types";
import { resetUser } from "../../../store/userSlice";
import ProducerCell from "../../OrderStatus/ProducerCell";
import FileCell from "../../OrderStatus/FileCell";
import StatusCell from "../../OrderStatus/StatusCell";

export default function JobsDesigner() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useStateSelector((state) => state.user);
  const dispatch = useStateDispatch();

  const { data: data, error } = jobApi.useGetDesignerJobsQuery({
    designerId: user.id,
    page: "0",
  });
  if (data && jobs.length == 0) {
    setJobs(data);
  }

  if (error && "status" in error && error.status == 401) {
    dispatch(resetUser());
  }

  return (
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
                    <ProducerCell />
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
  );
}