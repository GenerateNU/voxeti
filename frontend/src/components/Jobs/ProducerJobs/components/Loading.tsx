import { Box, CircularProgress, Container } from "@mui/material";

export default function Loading({ message = "Loading..." }) {
  return (
    <Container className="h-[60vh] min-h-[500px]">
      <Box className="flex flex-col justify-center items-center align-middle h-full">
        <CircularProgress />
        <h1 className="text-lg font-semibold animate-pulse mt-5">{message}</h1>
      </Box>
    </Container>
  );
}
