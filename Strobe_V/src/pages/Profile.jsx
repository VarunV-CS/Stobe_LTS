import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";

import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { AuthContext } from "../core/AuthContext";


const states = [
  { value: "alabama", label: "Alabama" },
  { value: "new-york", label: "New York" },
  { value: "san-francisco", label: "San Francisco" },
  { value: "los-angeles", label: "Los Angeles" },
];
const user = {
  name: "Sofia Rivers",
  avatar: "/assets/avatar.png",
  jobTitle: "Senior Developer",
  country: "USA",
  city: "Los Angeles",
  timezone: "GTM-7",
};

const Profile = () => {
  const {currentUser, updateUser} = React.useContext(AuthContext)
  const storedUser = JSON.parse(localStorage.getItem("authData")) || {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatar: "/assets/noavatar.jpg",
  };

  // State to manage form inputs
  const [formData, setFormData] = React.useState(currentUser);
  console.log(formData)
  const [showPassword, setShowPassword] = React.useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    // Update localStorage with the new form data
    // localStorage.setItem("authData", JSON.stringify(formData.user));
    alert("Profile updated successfully!");
  };
  return (
    <form onSubmit={handleSubmit}>
      {console.log(formData)}
      <Card
        sx={{
          backgroundColor: "transparent",
          boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
          maxWidth: "900px",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CardHeader title="Profile" />
        </Box>

        <Divider />
        <CardContent>
          <Grid
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Avatar
              src={'/noavatar.jpg'}
              sx={{ height: "80px", width: "80px" }}
            />
          </Grid>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>First name</InputLabel>
                <OutlinedInput
                  label="First name"
                  name="FirstName"
                  defaultValue=''
                  value={formData.FirstName}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput
                  label="Last name"
                  name="LastName"
                  defaultValue=''
                  value={formData.LastName}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required disabled>
                <InputLabel>Email</InputLabel>
                <OutlinedInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}

                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  defaultValue=''
                  onChange={handleInputChange}
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
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Grid
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
            
          >
          <CardActions  sx={{ padding: "10px" }}>
            <Button
              size="medium"
              variant="outlined"
              type="submit"
              sx={{  textTransform: "none", padding:'10px 30px', width:'10vw' }}
              
            >
              Update
            </Button>
          </CardActions>
        </Grid>
      </Card>
    </form>
  );
};

export default Profile;
