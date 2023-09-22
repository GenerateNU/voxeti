import { useEffect, useState } from 'react';

interface Profile {
    email: string;
    name: string;
    location: string;
    type: string;
}

export default function Profile() {
    const [profile, setProfile] = useState<Profile>({
        email: '',
        name: '',
        location: '',
        type: '',
    });
    const id = '1';

    useEffect(() => {
        console.log('Fetching profile')
        fetch(`/api/profile/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProfile(data);
            });
    }, []);

    return (
        <div>
            <h1>Profile</h1>
            <p>Email: {profile.email}</p>
            <p>Name: {profile.name}</p>
            <p>Location: {profile.location}</p>
            <p>User Type: {profile.type}</p>
        </div>
    );
}