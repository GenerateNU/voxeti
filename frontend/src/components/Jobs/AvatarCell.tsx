import { Avatar } from "@mui/material";

type ProducerCellProps = {
  avatar?: string,
  firstName?: string,
  lastName?: string,
  userType: 'designer' | 'producer'
}

export default function AvatarCell({ firstName, lastName, userType } : ProducerCellProps) {
  const avatarOutlineColor = {
    designer: '!bg-designer',
    producer: '!bg-producer',
  }
  
  return (
    <div className="flex items-center text-base">
      <Avatar
        sx={{
          width: 85,
          height: 85,
          marginRight: '20px'
        }}
        className={avatarOutlineColor[userType]}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Avatar 
            sx={{ 
              width: 70,
              height: 70
            }} 
          >
            {firstName?.charAt(0)}
          </Avatar>
        </Avatar>
      </Avatar>
      {(firstName && lastName) 
        ? firstName + " " + lastName 
        : userType === "producer" 
          ? "Awaiting Acceptance" 
          : "User Not Found"}
    </div>
  );
}
