import { Divider } from "@mui/material";
import OrderItem from "../components/JobCard/JobCard";
import Status from "../components/Status/Status";

export default function Jobs() {
    const newJob = {
        id: 'some-id',
        designerId: 'designer-id',
        producerId: 'producer-id',
        designId: 'design-id',
        status: Status.Pending,
        price: 100,
        color: 'red',
        filament: 'PLA',
        dimensions: {
          height: 10,
          width: 20,
          depth: 15
        },
        scale: 1,
        name: "Name"
      };

  return (



    <div className="flex flex-col justify-center items-center w-[75%] xl:w-[60%] mx-auto">
      <div className="text-left w-full py-10">
        <h1 className="text-4xl font-bold py-5">Job Requests</h1>
        <Divider />
      </div>
      {/* <StatusBox status={Status.InProgress} /> */}
      <OrderItem job={newJob} />
      <OrderItem job={newJob} />
      <OrderItem job={newJob} />
      <OrderItem job={newJob} />
    </div>
  );
}
