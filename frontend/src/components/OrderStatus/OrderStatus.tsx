import { Paper, Button, Typography, Box, Divider } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import StatusBox from "../Status/StatusBox";
import { Job } from "../../main.types";
import { useStateSelector } from "../../hooks/use-redux";

export default function OrderStatus(props: { job: Job }) {
  const { user } = useStateSelector((state) => state.user);
  return (
    <Paper className="p-4" elevation={0} sx={{ width: "100%" }}>
      <Typography variant="h4" component="h4" paddingY="10px">
        Order #{props.job.id} for {user.firstName + " " + user.lastName}
      </Typography>
      <Box display="flex" alignItems="center" paddingY="10px">
        <Typography
          variant="h6"
          component="h6"
          paddingY="10px"
          paddingRight="10px"
        >
          Status
        </Typography>
        <StatusBox status={props.job.status!} />
      </Box>
      <Divider />

      <Box my={5}>
        <Typography variant="subtitle1" className="flex items-center">
          {/* {job.steps.print ? ( */}
          <CheckCircleOutline className="text-producer" />
          {/* ) : null}{" "} */}
          1: Print
        </Typography>
        <Typography variant="body2">Print the requested items.</Typography>
      </Box>
      <Divider />

      <Box my={5}>
        <Typography variant="subtitle1" className="flex items-center">
          {/* {order.steps.ship ? ( */}
          <CheckCircleOutline className="text-producer" />
          {/* ) : null}{" "} */}
          2: Ship
        </Typography>
        <Typography variant="body2">
          Package the items and drop them off at your nearest post office.
        </Typography>
        {/* {!order.steps.ship && ( */}
        <Button
          variant="contained"
          sx={{ backgroundColor: "black" }}
          className="mt-2"
        >
          Print shipping label
        </Button>
        {/* )} */}
        {/* {order.steps.shipBy && ( */}
        <Typography variant="body2" className="text-sm">
          Ship by 10/10/10
        </Typography>
        {/* )} */}
      </Box>
      <Divider />

      <Box my={5}>
        <Typography variant="subtitle1" className="flex items-center">
          {/* {order.steps.deliver ? ( */}
          <CheckCircleOutline className="text-green-500" />
          {/* ) : null}{" "} */}
          3: Deliver
        </Typography>
        <Typography variant="body2">
          Your work is done! When this order has been delivered, the job will
          automatically be marked complete.
        </Typography>
        {/* {order.steps.deliveryEstimate && ( */}
        <Typography variant="body2" className="text-sm">
          Delivery Est. 10/10/10
        </Typography>
        {/* )} */}
      </Box>
    </Paper>
  );
}
