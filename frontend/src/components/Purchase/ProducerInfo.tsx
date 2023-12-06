import Avatar from "../Avatar/Avatar";

interface ProducerInfoProps {
    firstName: string;
    lastName: string;
    userType?: string;
}

export default function ProducerInfo({firstName, lastName, userType}: ProducerInfoProps) {

    const fullName = firstName + " " + lastName

    return (
        <div className=" flex justify-between">
            <div className=" flex flex-col">
                <h1 className="text-3xl text-opa pb-1">Your purchase with</h1>
                <h1 className="text-3xl font-bold">{fullName}</h1>
            </div>
            <div>
                <Avatar userType={userType} firstName={firstName} lastName={lastName} width={64} height={64} />
            </div>
        </div>
    );
}
