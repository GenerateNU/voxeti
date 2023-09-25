import ProfileData from '../components/ProfileData';
import ProfilePicture from '../components/ProfilePicture';

export default function Profile() {
    return (
        <div className="">
            <ProfilePicture />
            <ProfileData />
            <button className="outline">Edit Profile</button>
        </div>
    );
}