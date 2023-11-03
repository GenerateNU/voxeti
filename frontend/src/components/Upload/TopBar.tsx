import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function TopBar() {
    return (
        <div className="flex flex-row justify-between justify-items-center">
            <div className="text-3xl">
                Voxeti
            </div>
            <div className="flex flex-row items-center gap-8">
                <div className="text-md leading-5 font-extralight">
                    Create a Job
                </div>
                <NotificationsNoneIcon/>
                <div className="flex flex-row justify-items-center gap-2 bg-gray-200 rounded-full p-2">
                    <MenuIcon/>
                    <AccountCircleIcon/>
                </div>
            </div>
        </div>
    )
}