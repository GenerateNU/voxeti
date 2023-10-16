import Form, { Input, Label, Select } from "../../components/FormComponents";
import { useNavigate } from "@tanstack/react-router";
import { setPersonalInfo } from "../../store/userSlice";

export default function Step2() {

    const navigate = useNavigate({ from: '/registration/step2' });

    const onSubmit = (data: Record<string, any>) => {
        console.log(data);
        setPersonalInfo({
            firstName: data.firstName,
            lastName: data.lastName,
            address: {
                name: data.name,
                line1: data.street1,
                zipCode: data.zipCode,
                state: data.state,
                city: data.city,
                country: data.country
            }
        });
        navigate({ to: '/registration/step3' });
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <h1 className="text-5xl font-bold text-accent text-center">
                    Tell us more about yourself!
                </h1>
                <Label title="First Name" name="firstName" />
                <Input id="firstName" name="firstName" />
                <Label title="Last Name" name="lastName" />
                <Input id="lastName" name="lastName" />
                <Label title="Address Name" name="name" />
                <Input id="name" name="name" />
                <Label title="Street" name="street1" />
                <Input id="street1" name="street1" />
                <Label title="City" name="city" />
                <Input id="city" name="city" />
                <Label title="Zip Code" name="zipCode" />
                <Input id="zipCode" name="zipCode" />
                <Label title="State" name="state" />
                <Input id="state" name="state" />
                <Label title="Country" name="country" />
                <Select id="country" name="country" options={['United States']} />

                <button type="button" className="mr-2 outline mt-2"
                onClick={() => {navigate({ to: '/registration/step1' })}}>Back</button>
                <button type="submit" className="mr-2 outline mt-2">Continue</button>
            </Form>
        </div>
    );
}
