import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Link,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { Job } from "../../main.types";
import Status from "../Status/Status";

export default function OrderItem(props: {job: Job}) {

    const handleAccept = () => {
        // Implement the logic to accept the job
      };

      const handleDecline = () => {
        // Implement the logic to decline the job
      };
  return (
    <Box sx={{ width: "100%" }}>
      <Card elevation={0} style={{ margin: "20px 0", width: "100%" }}>
        <CardContent style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={""}
            style={{ width: 100, height: 100, marginRight: 20 }}
          />
          <div style={{ flexGrow: 1 }}>
            <Typography variant="h6">Order</Typography>
            <Typography variant="body1">${props.job.price}</Typography>
            <Typography variant="body2">Ship by: 10/10</Typography>
            <Typography variant="body2">Filament: {props.job.filament}</Typography>
            <Link
              href={"/jobs/"+props.job.id}
              color="primary"
              underline="hover"
              style={{ marginRight: 16 }}
            >
              View Details
            </Link>
          </div>
          {props.job.status === Status.Pending && (
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 1,
              }}>
              <Button
                variant="contained"
                style={{
                    width: "100%",
                    backgroundColor: "black",
                }}                onClick={handleAccept}
              >
                Accept
              </Button>
              <Button
                style={{
                    width: "100%",
                    color: "black",
                    borderColor: "black",
                }}
                variant="outlined"
                onClick={handleDecline}
              >
                Decline
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      <Divider />
    </Box>
  );
}
