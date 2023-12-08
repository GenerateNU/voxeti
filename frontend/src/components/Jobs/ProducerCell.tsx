import StyledAvatar from "../Avatar/Avatar";

type ProducerCellProps = {
  avatar?: string,
  firstName?: string,
  lastName?: string,
  userType: 'designer' | 'producer'
}

export default function ProducerCell({ firstName, lastName, userType } : ProducerCellProps) {

  return (
    <div className="flex items-center text-base">
      <StyledAvatar userType={userType} firstName={firstName} lastName={lastName} outerWidth={48} outerHeight={48} innerHeight={40} innerWidth={40} offset={4} />
      <div className=" pl-4">
        {(firstName && lastName)
          ? firstName + " " + lastName
          : userType === "producer"
            ? "Pending"
            : "User Not Found"}
      </div>
    </div>
  );
}
