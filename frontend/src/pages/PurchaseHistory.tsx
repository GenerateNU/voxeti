import Auth from "../components/Auth/Auth";
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
import { jobApi } from "../api/api";
import { useStateSelector } from "../hooks/use-redux";
import { PageStatus } from "../main.types";
import TableHeader from "../components/Jobs/TableHeader";
import Loading from "../components/Jobs/ProducerJobs/components/Loading";
import PurchaseRow from "../components/Purchase/PurchaseRow";


export default function PurchaseHistoryPage() {

    const { user } = useStateSelector((state) => state.user);

    return (
        <>
            <Auth authRoute={true}>
                <PurchaseHistory designerId={user.id} />
            </Auth>
        </>
    )
}

const PurchaseHistory = (props: { designerId: string }) => {

    const [pageStatus, setPageStatus] = useState<PageStatus>(
        PageStatus.Loading
    );
    const { data: jobs } = jobApi.useGetDesignerJobsQuery({
        designerId: props.designerId,
        page: "0",
    });

    useEffect(() => {
        if (jobs && jobs.length !== 0) {
            setPageStatus(PageStatus.Success);
        } else {
            setPageStatus(PageStatus.Error);
        }
    });

    const PageSuccess = () => {
        return jobs && jobs.length !== 0 && (
            <div className="py-32 w-full h-screen flex flex-col items-center">
              <div className=" px-4 w-full sm:w-3/5 flex flex-col">
                <h2 className="text-3xl py-5">Purchase History</h2>
                <TableContainer component={Paper} sx={{boxShadow: 'none', marginTop: '40px'}}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow sx={{ fontSize: '200px'}}>
                        <TableHeader title={'Producer'} />
                        <TableHeader title={'File Count'} />
                        <TableHeader title={'Price (USD)'} />
                        <TableHeader title={'Date Created'} />
                        <TableCell/>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {jobs.map((job) =>
                        <PurchaseRow job={job} type='producer' />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
        );
    }

    switch (pageStatus) {
        case PageStatus.Success:
            return <PageSuccess />;
        case PageStatus.Error:
            return <PageError />;
        case PageStatus.Loading:
            return <Loading />;
    }
}

const PageError = () => {
    return (
        <div className="py-32 w-full h-screen flex flex-col items-center">
            <div className=" px-4 w-full sm:w-3/5 flex flex-col">
                <h2 className="text-3xl py-5">Job Submissions</h2>
                <div className="mt-16 self-center flex flex-col items-center">
                    <h1 className='mt-10 text-xl'>
                        No jobs...
                    </h1>
                </div>
            </div>
        </div>
    );
}
