import TextField from "@mui/material/TextField";

export default function FieldValuePairs(props: {
  rows: [string, string?, string?][][];
  edit?: boolean;
  updateFields: (key: string, value: string) => void;
}) {

  return (
    <div className=" w-full sm:w-2/3">
      {props.rows.map((section) => {
        return (
          <div className="flex flex-row justify-between flex-1 pr-4">
            {section.map(([key, value, type]) => {
              return (
                <div className=" pb-4">
                  <div>{key}</div>
                  <TextField
                    id={`form-fields-${key.toLowerCase()}`}
                    key={key.toLowerCase()}
                    variant="standard"
                    size="small"
                    margin="none"
                    defaultValue={value ? value : ""}
                    placeholder={key}
                    type={type}
                    disabled={!props.edit}
                    onChange={(event) => {
                      props.updateFields(key, event.target.value);
                    }}
                    InputProps={{
                      disableUnderline: !props.edit,
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
