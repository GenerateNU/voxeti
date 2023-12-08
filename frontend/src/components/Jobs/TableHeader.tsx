import { TableCell } from "@mui/material";

type TableHeaderProps = {
  title: string;
};

export default function TableHeader({ title }: TableHeaderProps) {
  return (
    <TableCell
      sx={{
        padding: "0 0 20px 0",
        fontSize: "15px",
      }}
    >
      {title}
    </TableCell>
  );
}
