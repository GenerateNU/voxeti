import Form, { Input, Label } from "../../components/FormComponents";
import { useNavigate } from "@tanstack/react-router";
import { setCredentials } from "../../store/userSlice";

export default function Step1() {

    const navigate = useNavigate({ from: '/registration/step1' });

    const onSubmit = (data: Record<string, any>) => {
        console.log(data);
        setCredentials({
            email: data.email,
            password: data.password
        });
        navigate({ to: '/registration/step2' });
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <h1 className="text-5xl font-bold text-accent text-center">
                    Welcome to Voxeti
                </h1>
                <Label title="Email" name="email" />
                <Input id="email" name="email" />
                <Label title="Password" name="password" />
                <Input id="password" name="password" />

                <button type="submit" className="mr-2 outline mt-2">Create Account</button>
            </Form>
        </div>
    );
}
