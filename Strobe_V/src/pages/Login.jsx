import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { useNavigate } from "react-router";
import { BASE_URL } from "../core/constants";

import Snackbar from "@mui/material/Snackbar";
import SnackBar from "../components/SnackBar";
import { AuthContext } from "../core/AuthContext";

const schema = zod.object({
  email: zod.string().min(1, { message: "Email is required" }).email(),
  password: zod.string().min(1, { message: "Password is required" }),
});

const defaultValues = { email: "", password: "" };

const Login = () => {
  const navigate = useNavigate();
  const [openState, setOpenState] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState();
  const {updateUser} = React.useContext(AuthContext)

  const handleClick = () => {
    setOpenState(true);
    navigate("/");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenState(false);
  };

  React.useEffect(() => {
    if (localStorage.getItem("authData")) {
      navigate("/");
    }
  }, [navigate]);

  const [isPending, setIsPending] = React.useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values) => {
      setIsPending(true);
      try {
        const response = await fetch("http://167.172.164.218/users/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (response.ok) {
          // localStorage.setItem("authData", JSON.stringify(result));
          updateUser(result.user)
          setOpenState(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
        } else {
          setError("root", {
            type: "server",
            message: result.error || "Invalid credentials",
          });
        }
      } catch (error) {
        setError("root", {
          type: "server",
          message: "An error occurred. Please try again.",
        });
      } finally {
        setIsPending(false);
      }
    },
    [navigate, setError]
  );
  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", lg: "grid" },
          flexDirection: "column",
          gridTemplateColumns: "1fr 1fr",
          height: "100vh",
        }}
      >
        <Box
          sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column" }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flex: "1 1 auto",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Box sx={{ maxWidth: "450px", width: "100%" }}>
              <Stack spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Sign in</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Don&apos;t have an account?{" "}
                    <Link underline="hover" variant="subtitle2">
                      Sign up
                    </Link>
                  </Typography>
                </Stack>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={2}>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.email)}>
                          <InputLabel>Email address</InputLabel>
                          <OutlinedInput
                            {...field}
                            label="Email address"
                            type="email"
                          />
                          {errors?.email ? (
                            <FormHelperText>
                              {errors.email.message}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      )}
                    />
                    <Controller
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.password)}>
                          <InputLabel>Password</InputLabel>
                          <OutlinedInput
                            {...field}
                            endAdornment={
                              showPassword ? (
                                <EyeIcon
                                  cursor="pointer"
                                  fontSize="var(--icon-fontSize-md)"
                                  onClick={() => {
                                    setShowPassword(false);
                                  }}
                                />
                              ) : (
                                <EyeSlashIcon
                                  cursor="pointer"
                                  fontSize="var(--icon-fontSize-md)"
                                  onClick={() => {
                                    setShowPassword(true);
                                  }}
                                />
                              )
                            }
                            label="Password"
                            type={showPassword ? "text" : "password"}
                          />
                          {errors.password ? (
                            <FormHelperText>
                              {errors.password.message}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      )}
                    />
                    <div>
                      <Link
                        //   component={RouterLink}
                        //   href={paths.auth.resetPassword}
                        variant="subtitle2"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    {errors.root ? (
                      <Alert color="error">Invalid credentials</Alert>
                    ) : null}
                    {/* {errors.root ? (
                    <Alert color="error">{errors?.root?.message}</Alert>
                  ) : null} */}
                    <Button
                      disabled={isPending}
                      type="submit"
                      variant="contained"
                    >
                      Sign in
                    </Button>
                  </Stack>
                </form>
                {/* <Alert color="warning">
                Use{" "}
                <Typography
                  component="span"
                  sx={{ fontWeight: 700 }}
                  variant="inherit"
                >
                  sofia@devias.io
                </Typography>{" "}
                with password{" "}
                <Typography
                  component="span"
                  sx={{ fontWeight: 700 }}
                  variant="inherit"
                >
                  Secret1
                </Typography>
              </Alert> */}
              </Stack>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            alignItems: "center",
            background:
              "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
            color: "var(--mui-palette-common-white)",
            display: { xs: "none", lg: "flex" },
            justifyContent: "center",
            p: 3,
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography
                color="inherit"
                sx={{
                  fontSize: "24px",
                  lineHeight: "32px",
                  textAlign: "center",
                }}
                variant="h1"
              >
                Welcome to{" "}
                <Box component="span" sx={{ color: "#15b79e" }}>
                  Devias Kit
                </Box>
              </Typography>
              <Typography align="center" variant="subtitle1">
                A professional template that comes with ready-to-use MUI
                components.
              </Typography>
            </Stack>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                alt="Widgets"
                src="/assets/auth-widgets.png"
                sx={{ height: "auto", width: "100%", maxWidth: "600px" }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
      <SnackBar
        openState={openState}
        setOpenState={setOpenState}
        type="success"
        text="LOGIN SUCCESS!"
      />
    </>
  );
};

export default Login;
