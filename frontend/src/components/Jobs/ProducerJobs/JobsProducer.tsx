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
import { useStateSelector } from "../../../hooks/use-redux";
import ErrorImage from "../../../assets/hero-image-2.png"

export function JobFilesName(props: { designId: string }) {
  // const { data: data } = designApi.useGetDesignQuery(props.designId); Reinclude this once the design API works properly

  return <div>{props?.designId}</div>;
}

export default function JobsProducer() {
  const [jobFilter, setJobFilter] = useState("PENDING");
  const [pageStatus, setPageStatus] = useState<PageStatus>(
    PageStatus.Loading
  );

  // const dispatch = useStateDispatch();

  const JobTable = (props: { filter: string }) => {
    const handleChange = (event: SelectChangeEvent) => {
      setJobFilter(event.target.value as string);
    };
    const [jobs, setJobs] = useState<Job[]>([]);

    const { user } = useStateSelector((state) => state.user);

    const useQueryRecommendations = jobApi.useGetRecommendationsQuery({
      producerId: user.id,
      page: "1",
      limit: "10",
      filter: [
        "DISTANCE",
        "SUPPORTEDFILAMENTTYPES",
        "AVAILABLEFILAMENTTYPES",
        "AVAILABLECOLORS",
      ],
      sort: "PRICE",
    });

    const useQueryResponseOther = jobApi.useGetProducerJobsFilteredQuery({
      producerId: user.id as string, // Need to be changed to user.id when job schema is changed
      status: props.filter.toUpperCase(),
      page: "0",
    });

    useEffect(() => {
      if (
        jobFilter == "PENDING" &&
        useQueryRecommendations.isSuccess &&
        useQueryRecommendations.data
      ) {
        setJobs(useQueryRecommendations.data);
        setPageStatus(PageStatus.Success);
      } else if (
        jobFilter != "PENDING" &&
        useQueryResponseOther.isSuccess &&
        useQueryResponseOther.data
      ) {
        setJobs(useQueryResponseOther.data);
        setPageStatus(PageStatus.Success);
      } else if (
        useQueryResponseOther.isError &&
        useQueryRecommendations.isError
      ) {
        setPageStatus(PageStatus.Error);
      } else {
        setPageStatus(PageStatus.Error);
      }
    }, [useQueryResponseOther, useQueryRecommendations]);

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
            {(!useQueryRecommendations.data && !useQueryResponseOther.data) && (
              <div className="mt-16 self-center flex flex-col items-center">
              <img className='w-64' src={ErrorImage}/>
              <h1 className='mt-10 text-xl'>
                {`No ${filterOptions.filter((filter) => filter.value === jobFilter)[0].title.toLowerCase()} jobs...`}
              </h1>
            </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  return <JobTable filter={jobFilter} />;
}
