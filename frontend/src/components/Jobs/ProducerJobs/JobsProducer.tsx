import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { jobApi } from "../../../api/api";
// import { useStateSelector } from "../hooks/use-redux";
import { Job } from "../../../main.types";
import Loading from "./components/Loading";
import { PageStatus } from "../../../main.types";
import FilterDropDown from "../FilterDropDown";
import JobRow from "../JobRow";
import TableHeader from "../TableHeader";
import { useStateDispatch } from "../../../hooks/use-redux";
import { resetUser } from "../../../store/userSlice";

export function JobFilesName(props: { designId: string }) {
  // const { data: data } = designApi.useGetDesignQuery(props.designId); Reinclude this once the design API works properly

  return <div>{props?.designId}</div>;
}

export default function JobsProducer() {
  const [jobFilter, setJobFilter] = useState("Pending");
  const [pageStatus, setPageStatus] = useState<PageStatus>(
    PageStatus.Loading
  );

  const dispatch = useStateDispatch(); 

  const JobTable = (props: { filter: string }) => {
    const handleChange = (event: SelectChangeEvent) => {
      setJobFilter(event.target.value as string);
    };
    const [jobs, setJobs] = useState<Job[]>([]);

    // const { user } = useStateSelector((state) => state.user);

    const { data, isSuccess, error } = jobApi.useGetProducerJobsFilteredQuery({
      producerId: "", // Need to be changed to user.id when job schema is changed
      status: props.filter.toUpperCase(),
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
    }, [data, error, isSuccess]);

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
        title: "In Progress",
        value: "INPROGRESS"
      },
      {
        title: "In Shipping",
        value: "INSHIPPING"
      },
      {
        title: "Complete",
        value: "COMPLETE"
      },
    ]

    if (pageStatus == PageStatus.Loading) return <Loading />;

    return (
      <div className="py-32 w-full h-screen flex flex-col items-center">
        <div className=" px-4 w-full sm:w-3/5">
          <h2 className="text-3xl py-5">My Jobs</h2>
          <FilterDropDown 
            options={filterOptions}
            onChange={handleChange}
            value={jobFilter}
          />
          <TableContainer component={Paper} sx={{boxShadow: 'none', marginTop: '40px'}}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow sx={{ fontSize: '200px'}}>
                  <TableHeader title={'Designer'} />
                  <TableHeader title={'File Count'} />
                  <TableHeader title={'Price (USD)'} />
                  <TableHeader title={'Ship By'} />
                  <TableCell/>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) =>
                  <JobRow job={job} type='designer' />
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div>
            {!data && (
              <h2 className=" text-xl py-8 text-center">No Matching Jobs</h2>
            )}
          </div>
        </div>
      </div>
    );
  };
  return <JobTable filter={jobFilter} />;
}
