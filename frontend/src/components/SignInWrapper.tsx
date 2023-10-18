import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <img src="/favicon.ico" alt="Profile Picture" />
            <Typography component="h1" variant="h5" sx={{ textAlign: "left", fontSize: "2rem" }}>
              Sign in
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            border-radius="50px"
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              InputProps={{
                style: {
                  borderRadius: "10px",
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                style: {
                  borderRadius: "10px",
                },
              }}
            />
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <FormControlLabel
                  required
                  control={<Checkbox />}
                  label="Required"
                  sx={{ py: 1 }}
                />
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" sx={{ py: 1, color: 'black', textDecoration: 'none' }}>
                  {"Forgot password?"}
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="inherit"
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" sx={{ py: 1, color: 'black', textDecoration: 'none' }}>
                  {"Don't have an account?"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
