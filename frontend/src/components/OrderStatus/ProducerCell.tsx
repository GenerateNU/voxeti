import { Avatar } from "@mui/material";

type ProducerCellProps = {
  avatar?: string,
  firstName?: string,
  lastName?: string,
}

export default function ProducerCell({ avatar, firstName, lastName } : ProducerCellProps) {
  return (
    <div className="flex items-center text-lg">
      <Avatar
        style={{
          width: 80,
          height: 80,
          marginRight: 20,
          backgroundColor: "#87CEEB",
          color: "#87CEEB",
        }}
      >
        <Avatar
          style={{
            width: 70,
            height: 70,
            backgroundColor: "#FFFFFF",
            color: "#FFFFFF",
          }}
        >
          <Avatar src={avatar ?? ""} style={{ width: 60, height: 60 }} />
        </Avatar>
      </Avatar>

      {(firstName && lastName) ? firstName + " " + lastName : "Awaiting Acceptance"}
    </div>
  );
}
