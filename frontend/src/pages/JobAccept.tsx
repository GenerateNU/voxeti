import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar } from "@mui/material";
import Link from "@mui/material/Link";
import { jobApi, userApi } from "../api/api";
import { useStateSelector } from "../hooks/use-redux";
import { Job } from "../main.types";
import Loading from "../components/JobAccept/Loading";
import { PageStatus } from "../main.types";

export function JobFilesName(props: { designId: string }) {
  // const { data: data } = designApi.useGetDesignQuery(props.designId); Reinclude this once the design API works properly

  return <div>{props?.designId}</div>;
}

export default function JobAccept() {
  const [jobFilter, setJobFilter] = React.useState("Pending");
  const [pageStatus, setPageStatus] = React.useState<PageStatus>(
    PageStatus.Loading
  );

  const JobTable = (props: { filter: string }) => {
    const handleChange = (event: SelectChangeEvent) => {
      setJobFilter(event.target.value as string);
    };
    const [rows, setRows] = React.useState<Job[]>([]);

    const { user } = useStateSelector((state) => state.user);

    const useQueryResponse = jobApi.useGetDesignerJobsFilteredQuery({
      designerId: user.id,
      status: props.filter.toUpperCase(),
      page: "0",
    });

    const DesignerName = (props: { designerId: string }) => {
      const { data: designer } = userApi.useGetUserQuery(props.designerId);

      if (designer) {
        const fullName = designer.firstName + " " + designer.lastName;
        return <div>{fullName}</div>;
      }

      return <div>Designer Not Found</div>;
    };

    const FilterDropDown = () => {
      return (
        <Box sx={{ minWidth: 120 }}>
          <FormControl className=" py-4 w-48">
            <InputLabel id="demo-simple-select-label">Jobs</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={jobFilter}
              label="Jobs"
              onChange={handleChange}
              defaultValue="Pending"
            >
              <MenuItem key={"Pending"} value={"Pending"}>
                Pending
              </MenuItem>
              <MenuItem key={"Accepted"} value={"Accepted"}>
                Accepted
              </MenuItem>
              <MenuItem key={"InProgress"} value={"InProgress"}>
                In Progress
              </MenuItem>
              <MenuItem key={"InShipping"} value={"InShipping"}>
                Shipped
              </MenuItem>
              <MenuItem key={"Complete"} value={"Complete"}>
                Completed
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      );
    };

    const JobTableRow = (props: { row: Job }) => {
      return (
        <TableRow
          component={Link}
          href={`/job-accept/${props.row.id}`}
          underline="none"
          className="hover:bg-producer"
          key={props.row.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <div className=" flex flex-row items-center">
              <Avatar
                className=" outline outline-3 outline-offset-2 outline-designer"
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
              />
              <div className="px-3">
                <DesignerName designerId={props.row.designerId} />
              </div>
            </div>
          </TableCell>
          <TableCell align="right">
            {props.row.designId.map((designId) => {
              return <JobFilesName designId={designId} />;
            })}
          </TableCell>
          <TableCell align="right">
            ${(props.row.price / 100).toFixed(2)}
          </TableCell>
        </TableRow>
      );
    };

    React.useEffect(() => {
      if (useQueryResponse.isSuccess) {
        setRows(useQueryResponse.data);
        setPageStatus(PageStatus.Success);
      } else if (useQueryResponse.isError) {
        setPageStatus(PageStatus.Error);
      }
    }, [useQueryResponse, jobFilter]);

    if (pageStatus == PageStatus.Loading) return <Loading />;

    return (
      <div className="py-32 w-full h-screen flex flex-col items-center justify-center">
        <div className=" px-4 w-full sm:w-3/5">
          <h2 className=" font-bold text-2xl py-8">My Jobs</h2>
          <FilterDropDown />
          <div className=" py-2"></div>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Designer</TableCell>
                  <TableCell align="right">File Name(s)</TableCell>
                  <TableCell align="right">Price&nbsp;(USD)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <JobTableRow row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div>
            {!useQueryResponse.data && (
              <h2 className=" text-xl py-8 text-center">No Matching Jobs</h2>
            )}
          </div>
        </div>
      </div>
    );
  };
  return <JobTable filter={jobFilter} />;
}
