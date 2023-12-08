import { Avatar } from "@mui/material";

type ProducerCellProps = {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  userType: "designer" | "producer";
  imageOnly: boolean;
  size: number;
};

export default function AvatarCell({
  firstName,
  lastName,
  userType,
  imageOnly,
  size,
}: ProducerCellProps) {
  const avatarOutlineColor = {
    designer: "!bg-designer",
    producer: "!bg-producer",
  };

  return (
    <div className="flex items-center text-base">
      <Avatar
        sx={{
          width: size,
          height: size,
          marginRight: "20px",
        }}
        className={avatarOutlineColor[userType]}
      >
        <Avatar
          sx={{
            width: size - 5,
            height: size - 5,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Avatar
            sx={{
              width: size - 15,
              height: size - 15,
            }}
          >
            {firstName && lastName ? firstName.charAt(0) : undefined}
          </Avatar>
        </Avatar>
      </Avatar>
      {!imageOnly &&
        (firstName && lastName
          ? firstName + " " + lastName
          : userType === "producer"
          ? "Awaiting Acceptance"
          : "User Not Found")}
    </div>
  );
}
