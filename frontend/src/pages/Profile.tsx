import { useEffect, useState } from 'react';

export default function Profile() {
    let profile: any;
    let setProfile: any;
    [profile, setProfile] = useState(null);

    // useEffect(() => {
    //     fetch("https://localhost:3000/api/profile")
    //     .then(response => response.json())
    //     .then(data => setProfile(data))
    //   },[])

    useEffect(() => {
        const exampleProfile = {
            email: "test",
            name: "name",
            location: "location",
            type: "type"
        }
        setProfile(exampleProfile)
      },[])

    


    return (
    <div>
        {profile && (
            <div>
                <h1>Email: {profile['email']}</h1>
                <h1>Name: {profile['name']}</h1>
                <h1>Location: {profile['location']}</h1>
                <h1>User Type: {profile['type']}</h1>
            </div>
        )
        }
    </div>);
}