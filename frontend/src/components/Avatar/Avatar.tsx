import { Avatar } from "@mui/material"
import { StyledAvatarProps } from "./Avatar.types"

export default function CustomAvatar({ userType, firstName, lastName, height, width }: StyledAvatarProps) {
    const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()

    return <Avatar className={` outline outline-4 outline-offset-4 ${userType == "PRODUCER" ? "outline-producer" : "outline-designer"}`} alt={`${firstName} ${lastName}`} sx={{ width: width, height: height }}>{initials}</Avatar>
}
