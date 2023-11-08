import OrderInformationPage from "../components/OrderInfoPage/OrderInfoPage";
import OrderStatus from "../components/OrderStatus/OrderStatus";
import Status from "../components/Status/Status";

export default function JobDetails() {

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
        <OrderStatus job={newJob} />
        <OrderInformationPage job={newJob}/>
    </div>
    )
}