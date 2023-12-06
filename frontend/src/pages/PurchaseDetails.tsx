import { useState, useEffect } from "react";
import Auth from "../components/Auth/Auth";
import { Job, PageStatus } from "../main.types";
import { Divider, IconButton } from "@mui/material";
import ProducerInfo from "../components/Purchase/ProducerInfo"
import ShippingInfo from "../components/Purchase/ShippingInfo";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "@mui/material";
import { useParams } from "@tanstack/react-router";
import { jobApi } from "../api/api";
import { userApi } from "../api/api";
import { useApiError } from "../hooks/use-api-error";
import Loading from "../components/Jobs/ProducerJobs/components/Loading";

export default function PurchaseDetailsPage() {
    return (
        <>
            <Auth authRoute={true}>
                <PurchaseDetails />
            </Auth>
        </>
    );
}

function PurchaseDetails() {

    const [pageStatus, setPageStatus] = useState<PageStatus>(
        PageStatus.Success
    );
    // const { addError, setOpen } = useApiError();
    // const [jobDetails] = jobApi.useGetJobMutation();
    // const [job, setJob] = useState<Job>();
    // const [producer, setProducer] = useState<any>();
    // const params = useParams()

    // useEffect(() => {
    //     if (params.jobId) {
    //         jobDetails(params.jobId)
    //           .unwrap()
    //           .then((jobData: Job) => {
    //             setJob(jobData as Job);

    //             const producerId = jobData.producerId;
    //             if (producerId) {
    //                 const { data: producerData } = userApi.useGetUserQuery(producerId);
    //                 setProducer(producerData);
    //             }
    //           })
    //           .catch((error) => {
    //             addError("Error fetching job details");
    //             setOpen(true);
    //             console.log(error);
    //             setPageStatus(PageStatus.Error);
    //           });
    //     }
    // }, []);

    const SAMPLE_JOB: Job = {
        createdAt: new Date(),
        designerId: 'designer123',
        producerId: 'producer456',
        designId: ['design1', 'design2'],
        quantity: [5, 10],
        status: "PENDING",
        price: 100.0,
        shipping: 15.0,
        taxes: 5.0,
        color: 'blue',
        filament: "PLA",
        layerHeight: 0.2,
        shippingAddress: {
            name: 'John Doe',
            line1: '456 Oak Street',
            line2: 'Apt 203',
            zipCode: '54321',
            city: 'Townsville',
            state: 'State',
            country: 'Country',
            location: {
              longitude: -74.6579199,
              latitude: 40.4691243,
        },
        },
        trackingNumber: '123456789',
      };

    const CustomDivider = () => {
        return (
          <div className="py-10">
            <Divider />
          </div>
        );
    };

    const BackButton = () => {
        return (
            <div className="pb-5">
                <IconButton href="/purchase-history" aria-label="delete" size="small">
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

    const TrackingNumber = () => {
        return (
            <div className="flex justify-between">
                <p className="text-base">Tracking Number</p>
                {/* <p className="text-base">{job?.trackingNumber}</p> */}
                <p className="text-base">{SAMPLE_JOB.trackingNumber}</p>
            </div>
        )
    }

    const Price = () => {
        return (
            <div className="flex justify-between">
                <p className="text-base">Price</p>
                {/* <p className="text-base">{job?.price}</p> */}
                <p className="text-base">{SAMPLE_JOB.price}</p>

            </div>
        )
    }

    const PageError = () => {
        return (
            <div className="py-32 w-full h-screen flex flex-col items-center">
                <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
                    <BackButton />
                    <p className="text-3xl font-bold">Error fetching job details</p>
                </div>
            </div>
        );
    }

    const PageSuccess = () => {
        return (
            <div className="py-32 w-full h-screen flex flex-col items-center">
                <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
                    <BackButton />
                    {/* <ProducerInfo firstName={producer.firstName} lastName={producer.lastName}  userType={producer.userType} /> */}
                    <ProducerInfo firstName={"Garrett"} lastName={"Ladley"}  userType={"PRODUCER"} />
                    <CustomDivider />
                    {/* <ShippingInfo job={job} /> */}
                    <ShippingInfo job={SAMPLE_JOB} />
                    <CustomDivider />
                    <TrackingNumber />
                    <CustomDivider />
                    <Price />
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



// {job && producer && (
//     <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
//         <BackButton />
//         {/* <ProducerInfo firstName={producer.firstName} lastName={producer.lastName}  userType={producer.userType} /> */}
//         <ProducerInfo firstName={"Garrett"} lastName={"Ladley"}  userType={"PRODUCER"} />
//         <CustomDivider />
//         {/* <ShippingInfo job={job} /> */}
//         <ShippingInfo job={SAMPLE_JOB} />
//         <CustomDivider />
//         <TrackingNumber />
//         <CustomDivider />
//         <Price />
//         <CustomDivider />
//     </div>
// )}
