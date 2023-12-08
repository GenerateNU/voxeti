import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

type FilterOption = {
  title: string;
  value: string;
};

type FilterDropDownProps = {
  options: Array<FilterOption>;
  onChange: (event: SelectChangeEvent) => void;
  value: string;
};

export default function FilterDropDown({
  options,
  onChange,
  value,
}: FilterDropDownProps) {
  return (
    <Box sx={{ minWidth: 120, marginTop: "20px" }}>
      <FormControl className=" py-4 w-48">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Jobs"
          onChange={onChange}
          defaultValue="Pending"
          variant="standard"
          sx={{
            width: 120,
            ":before": {
              borderBottom: 0,
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
