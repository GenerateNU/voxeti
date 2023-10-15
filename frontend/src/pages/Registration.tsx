import Form, { Input, Select } from "../components/FormComponents";

export default function Registration() {
  const onSubmit = (data: Record<string, any>) => console.log(data);

  return (
    <div>
      <h1 className="text-5xl font-bold text-accent text-center">
        Users Registration
      </h1>

      <Form onSubmit={onSubmit}>
        <Input name="firstName" />
        <Input name="lastName" />
        <Select name="gender" options={["female", "male", "other"]} />
      </Form>
    </div>
  );
}
