import { useState, useEffect } from "react";
import Auth from "../components/Auth/Auth";
import { PageStatus } from "../main.types";
import { Divider, IconButton } from "@mui/material";
import ProducerInfo from "../components/Purchase/ProducerInfo"
import ShippingInfo from "../components/Purchase/ShippingInfo";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "@mui/material";
import { useParams } from "@tanstack/react-router";
import { jobApi } from "../api/api";
import Loading from "../components/Jobs/ProducerJobs/components/Loading";

export default function PurchaseDetailsPage() {

    const params = useParams()
    const jobId = params.jobId as string;

    return jobId ? (
        <>
            <Auth authRoute={true}>
                <PurchaseDetails jobId={jobId} />
            </Auth>
        </>
    ) : (
        <PageError />
    );
}

const PurchaseDetails = (props: {jobId: string}) => {

    const [pageStatus, setPageStatus] = useState<PageStatus>(
        PageStatus.Loading
    );
    const { data: job } = jobApi.useGetJobByIdQuery(props.jobId);

    useEffect(() => {
        if (job && job.producerId && job.trackingNumber && job.estimatedDelivery) {
            setPageStatus(PageStatus.Success);
        } else {
            setPageStatus(PageStatus.Error);
        }
    }, [job]);

    const PageSuccess = () => {
        return job && job.producerId && job.trackingNumber && job.estimatedDelivery && (
            <div className="py-32 w-full h-screen flex flex-col items-center">
                <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
                    <BackButton />
                    <ProducerInfo producerId={job.producerId} />
                    <CustomDivider />
                    <ShippingInfo shippingAddress={job.shippingAddress} estimatedDelivery={job.estimatedDelivery} />
                    <CustomDivider />
                    <TrackingNumber trackingNumber={job.trackingNumber} />
                    <CustomDivider />
                    <Price price={job.price}/>
                    <CustomDivider />
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

const TrackingNumber = (props: {trackingNumber: string}) => {
    return (
        <div className="flex justify-between">
            <p className="text-base">Tracking Number</p>
            <p className="text-base">{props.trackingNumber}</p>
        </div>
    )
}

const Price = (props: {price: number}) => {
    return (
        <div className="flex justify-between">
            <p className="text-base">Price</p>
            <p className="text-base">${props.price}</p>
        </div>
    )
}

const BackButton = () => {
    return (
        <div className="pb-5">
            <IconButton aria-label="delete" size="small">
                <ArrowBackIosIcon fontSize="inherit" color="inherit" style={{ opacity: 0.75 }} />
                <Link
                    href="/purchase-history"
                    underline="none"
                    color="black"
                >
                    <p className=" text-base opacity-50">Purchase History</p>
                </Link>
            </IconButton>
        </div>
    );
};

const CustomDivider = () => {
    return (
      <div className="py-10">
        <Divider />
      </div>
    );
};

const PageError = () => {
    return (
        <div className="py-32 w-full h-screen flex flex-col items-center">
            <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
                <BackButton />
                <p className="text-3xl font-bold">Error fetching job details</p>
            </div>
        </div>
    );
};
