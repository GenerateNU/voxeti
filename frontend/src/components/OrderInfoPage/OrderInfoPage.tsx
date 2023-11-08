import React from "react";
import {
  Typography,
  Paper,
  Box,
  Divider,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Job from "../Job";

const OrderInformationPage: React.FC<Job> = ({ job }) => {
  return (
    <Paper elevation={0} sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Divider sx={{ width: "100%", my: 2 }} />
        <Typography
          variant="h4"
          paddingY="20px"
          component="div"
          sx={{ alignSelf: "flex-start" }}
        >
          {" "}
          Order Information
        </Typography>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              src={""}
              sx={{ width: 75, height: 75, mx: 2 }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={job.name}
            // secondary={job.customerTitle}
          />
        </ListItem>
      </Box>

      <List disablePadding>
        <ListItem>
          <ListItemText primary="File" secondary={""} />
          <FileDownloadIcon />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Quantity"
            // secondary={`${job.quantity} piece${job.quantity > 1 ? "s" : ""}`}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Color" secondary={job.color} />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <ListItemText primary="Order Placed" secondary="10/10" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Ship By" secondary="10/10" />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Estimated Delivery Date"
            secondary="10/10"
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Address" secondary="" />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <ListItemText
            primary="Payment"
            secondary={`$${job.price!.toFixed(2)}`}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default OrderInformationPage;