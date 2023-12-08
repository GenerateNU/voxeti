import StyledAvatar from "../Avatar/Avatar";
import  { userApi } from "../../api/api";

export default function ProducerInfo(props: {producerId?: string}) {

    if (!props.producerId || props.producerId === "000000000000000000000000") {
        return (
            <p className=" text-3xl">Producer Pending...</p>
        );
    }
    const { data: producer } = userApi.useGetUserQuery(props.producerId);

    return producer && (
        <div className=" flex justify-between">
            <div className=" flex flex-col">
                <h1 className="text-3xl pb-1">Your purchase with</h1>
                <h1 className="text-3xl font-bold">{producer.firstName} {producer.lastName}</h1>
            </div>
            <div>
                <StyledAvatar userType={"PRODUCER"} firstName={producer.firstName} lastName={producer.lastName} innerWidth={52} innerHeight={52} outerHeight={64} outerWidth={64} offset={6} />
            </div>
        </div>
    );
}
