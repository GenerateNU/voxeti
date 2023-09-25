import { useEffect, useState } from 'react';

interface UserProfile {
    email: string;
    name: string;
    location: string;
    type: string;
}

export default function ProfileData() {

    const [profile, setProfile] = useState<UserProfile>({
        email: '',
        name: '',
        location: '',
        type: '',
    });
    const id = '1';

    useEffect(() => {
        fetch(`/api/profile/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProfile(data);
            });
    }, []);

    return (
        <div>
            <h3 className="font-bold text-2xl">Public Info</h3>
            <p>Name: {profile.name}</p>
            <p>Location: {profile.location}</p>
            <p>User Type: {profile.type}</p>
            <h3 className="font-bold text-2xl">Personal Info</h3>
            <p>Email: {profile.email}</p>
            <h3 className="font-bold text-2xl">Billing Information</h3>
            <h3 className="font-bold text-2xl">Transaction History</h3>
        </div>
    );
}