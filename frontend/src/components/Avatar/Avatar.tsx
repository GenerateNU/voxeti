import { Avatar } from "@mui/material"
import { StyledAvatarProps } from "./Avatar.types"

export default function CustomAvatar({ userType, firstName, lastName, innerHeight, innerWidth, outerWidth, outerHeight, offset }: StyledAvatarProps) {

    const colors = {
        "outer": "",
        "inner": "#FFFFFF"
    }

    if (userType == "PRODUCER") {
        colors["outer"] = "#00baef"
    } else {
        colors["outer"] = "#efaf00"
    }

    if (!firstName || !lastName) {
        return (
            <Avatar sx={{ width: outerWidth, height: outerHeight, color: colors['outer'], backgroundColor: colors['outer'] }}>
                <Avatar sx={{ width: innerWidth+offset, height: innerHeight+offset, color: colors['inner'], backgroundColor: colors['inner'] }}>
                    <Avatar sx={{ width: innerWidth, height: innerHeight }} />
                </Avatar>
            </Avatar>
        )

    }

    const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()

    return (
        <Avatar sx={{ width: outerWidth, height: outerHeight, color: colors['outer'], backgroundColor: colors['outer'] }}>
            <Avatar sx={{ width: innerWidth+offset, height: innerHeight+offset, color: colors['inner'], backgroundColor: colors['inner'] }}>
                <Avatar sx={{ width: innerWidth, height: innerHeight }}>
                    {initials}
                </Avatar>
            </Avatar>
        </Avatar>
    )
        
}
