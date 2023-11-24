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
import { designApi, jobApi, userApi } from "../api/api";
import { useStateSelector } from "../hooks/use-redux";
import { Job } from "../main.types";

export default function JobAccept() {
  const [jobFilter, setJobFilter] = React.useState("Pending");

  const handleChange = (event: SelectChangeEvent) => {
    setJobFilter(event.target.value as string);
  };
  const [rows, setRows] = React.useState<Job[]>([]);

  const { user } = useStateSelector((state) => state.user);

  const { data: data } = jobApi.useGetProducerJobsQuery({
    producerId: user.id,
    page: "0",
  });

  React.useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);
  return (
    <div className="py-32 w-full h-screen flex flex-col items-center justify-center">
      <div className=" px-4 w-full sm:w-3/5">
        <h2 className=" font-bold text-2xl py-8">My Jobs</h2>
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
              <MenuItem value={"Pending"}>Pending</MenuItem>
              <MenuItem value={"Accepted"}>Accepted</MenuItem>
              <MenuItem value={"InProgress"}>In Progress</MenuItem>
              <MenuItem value={"InShipping"}>Shipped</MenuItem>
              <MenuItem value={"Complete"}>Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
                <TableRow
                  component={Link}
                  href={`/job-accept/${row.id}`}
                  underline="none"
                  className="hover:bg-producer"
                  key={row.id}
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
                        {row &&
                          (() => {
                            const { data: designer } = userApi.useGetUserQuery(row.designerId);
                            if (designer) {
                              return (
                                designer.firstName + " " + designer.lastName
                              );
                            }
                            return "Designer Not Found"; 
                          })()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {row.designId
                      .map(async (designId) => {
                        const { data: designInfo } =
                          designApi.useGetDesignQuery(designId);

                        if (designInfo) {
                          return `${designInfo.name}`;
                        }

                        return "Design Not Found"; 
                      })
                      .join(", ")}
                  </TableCell>
                  <TableCell align="right">${row.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
