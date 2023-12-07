import Avatar from "../Avatar/Avatar";
import  { userApi } from "../../api/api";

export default function ProducerInfo(props: {producerId: string}) {

    const { data: producer } = userApi.useGetUserQuery(props.producerId);

    return producer ? (
        <div className=" flex justify-between">
            <div className=" flex flex-col">
                <h1 className="text-3xl pb-1">Your purchase with</h1>
                <h1 className="text-3xl font-bold">{producer.firstName} {producer.lastName}</h1>
            </div>
            <div>
                <Avatar userType={"PRODUCER"} firstName={producer.firstName} lastName={producer.lastName} width={64} height={64} />
            </div>
        </div>
    ) : (
        <p className=" text-base">Producer not found</p>
    );
}
