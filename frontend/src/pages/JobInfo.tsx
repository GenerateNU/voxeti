import { useParams } from "@tanstack/react-router";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, IconButton } from "@mui/material";
import { Link } from "@mui/material";
import { Avatar } from "@mui/material";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Augment the palette to include an black color
declare module "@mui/material/styles" {
  interface Palette {
    black: Palette["primary"];
  }

  interface PaletteOptions {
    black?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include an black option
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    black: true;
  }
}

const theme = createTheme({
  palette: {
    black: {
      main: "#000000",
      light: "#AAAAAA",
      dark: "#020202",
      contrastText: "#FFFFFF",
    },
  },
});

var jobInfo = [
  [
    { field: "File", value: "3Dfile.stl" },
    { field: "Quantity", value: "1 piece" },
    { field: "Color", value: "Black" },
  ],
  [
    { field: "Order Placed", value: "10/21/2023" },
    { field: "Ship By", value: "10/24/2023" },
    { field: "Est. Delivery", value: "10/31/2023" },
    { field: "Address", value: "50 Leon St. Boston, MA 02115" },
  ],
  [{ field: "Price", value: "$502.25" }],
];

var designerName = "Emily Hendrick";

var jobStatus = "Pending";

export default function JobInfo() {
  const params = useParams();

  console.log(params);

  const renderButtons = () => {
    if (jobStatus === "Pending") {
      return (
        <div className=" flex flex-row flex-wrap items-center justify-end gap-y-1 gap-x-2">
          <Button variant="contained" color="black" className=" w-32">
            Accept
          </Button>
          <Button variant="outlined" color="black" className=" w-32">
            Decline
          </Button>
        </div>
      );
    } else {
      return (
        <div className=" flex flex-row flex-wrap items-center justify-end gap-y-1 gap-x-4">
          <p className=" text-producer">JOB ACCEPTED</p>
          <Button variant="outlined" color="black" className="">
            Current Jobs
          </Button>
        </div>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="py-32 w-full h-screen flex flex-col items-center justify-center">
        <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
          <IconButton aria-label="delete" size="small">
            <ArrowBackIosIcon fontSize="inherit" />
            <Link
              href="/job-accept"
              underline="none"
              color="black"
              sx={{ cursor: "pointer" }}
              className="!hidden md:!flex"
            >
              My Jobs
            </Link>
          </IconButton>
          <div className=" py-3" />
          <div className=" flex flex-row justify-between">
            <div className=" flex flex-row items-center">
              <Avatar
                className=" outline outline-3 outline-offset-2 outline-designer"
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{ width: 64, height: 64 }}
              />
              <div className=" px-4">
                <p className=" text-lg font-medium">{designerName}</p>
                <p className=" text-sm">Designer</p>
              </div>
            </div>
            {renderButtons()}
          </div>
          {jobInfo.map((section) => (
            <div className=" flex flex-col">
              <Divider variant="middle" className=" py-3" />
              <div className=" py-3" />
              {section.map((row) => (
                <div className=" flex justify-between py-1">
                  <p>{row.field}</p>
                  <p>{row.value}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}
