import Divider from "@mui/material/Divider";

export default function FieldValueRow(props: {
  section: { field?: string; value?: string }[];
}) {
  return (
    <div className=" flex flex-col">
      <Divider variant="middle" className="!m-0 py-3" />
      <div className=" py-3" />
      {props.section.map((row) => (
        <div className=" flex justify-between py-1">
          <p>{row.field}</p>
          <p>{row.value}</p>
        </div>
      ))}
    </div>
  );
}
