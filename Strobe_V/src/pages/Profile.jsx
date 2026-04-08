import React from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { AuthContext } from "../core/AuthContext";
import { BASE_URL } from "../core/constants";


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

const getInitialUser = (currentUser) => {
  const storedUser = JSON.parse(localStorage.getItem("authData")) || {};
  return currentUser || storedUser || {};
};

const Profile = () => {
  const { currentUser, updateUser } = React.useContext(AuthContext);
  const initialUser = React.useMemo(() => getInitialUser(currentUser), [currentUser]);

  const [formData, setFormData] = React.useState(initialUser);
  const [editSection, setEditSection] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordDraft, setPasswordDraft] = React.useState("");
  const [feedback, setFeedback] = React.useState(null);
  const [savingSection, setSavingSection] = React.useState(null);

  React.useEffect(() => {
    setFormData(initialUser);
  }, [initialUser]);

  const firstName = formData?.FirstName || formData?.firstName || "";
  const lastName = formData?.LastName || formData?.lastName || "";
  const email = formData?.email || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Your profile";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  const userId = formData?._id || initialUser?._id;
  const avatarSrc = formData?.avatar || "/assets/noavatar.jpg";

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startEditing = (section) => {
    setFeedback(null);
    setEditSection(section);
    if (section === "security") {
      setPasswordDraft("");
    }
  };

  const cancelEditing = () => {
    setFormData(initialUser);
    setPasswordDraft("");
    setShowPassword(false);
    setEditSection(null);
  };

  const saveProfileChanges = async (payload, successMessage) => {
    if (!userId) {
      setFeedback({ type: "error", message: "Unable to find user ID." });
      return;
    }

    setFeedback(null);
    const response = await fetch(`${BASE_URL}users/updateUser/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result?.success || !result?.user) {
      throw new Error(result?.message || "Failed to save changes.");
    }

    setFormData(result.user);
    updateUser(result.user);
    setEditSection(null);
    setFeedback({ type: "success", message: successMessage });
    return result.user;
  };

  const savePersonalInfo = async () => {
    const payload = {
      FirstName: (formData?.FirstName || "").trim(),
      LastName: (formData?.LastName || "").trim(),
    };

    setSavingSection("personal");

    try {
      await saveProfileChanges(payload, "Personal details updated successfully.");
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSavingSection(null);
    }
  };

  const savePassword = async () => {
    const trimmedPassword = passwordDraft.trim();
    if (!trimmedPassword) {
      setFeedback({ type: "error", message: "Enter a password." });
      return;
    }

    setSavingSection("security");

    try {
      await saveProfileChanges({ password: trimmedPassword }, "Password updated successfully.");
      setPasswordDraft("");
      setShowPassword(false);
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Profile
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Review your account details and update section by section.
          </Typography>
        </Box>
        <Chip
          color="success"
          icon={<CheckCircleOutlineIcon />}
          label="Backend sync enabled"
          variant="outlined"
        />
      </Box>

      {feedback && <Alert severity={feedback.type}>{feedback.message}</Alert>}

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(160deg, rgba(17, 24, 39, 1) 0%, rgba(30, 41, 59, 1) 100%)",
              color: "common.white",
              boxShadow: "0 24px 48px rgba(15, 23, 42, 0.18)",
              borderRadius: 4,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Avatar
                  src={avatarSrc}
                  sx={{
                    width: 88,
                    height: 88,
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "common.white",
                  }}
                >
                  {initials}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {fullName}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 1 }}>
                    {email || "No email available"}
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.65)" }}>
                      Account status
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>Signed in and active</Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.65)" }}>
                      Editing style
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      Changes saved section by section
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <PersonOutlineIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Personal information
                        </Typography>
                      </Stack>
                    </Box>
                    {editSection === "personal" ? (
                      <Stack direction="row" spacing={1.5}>
                        <Button color="inherit" variant="text" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={savePersonalInfo}
                          disabled={savingSection === "personal"}
                        >
                          {savingSection === "personal" ? "Saving..." : "Save changes"}
                        </Button>
                      </Stack>
                    ) : (
                      <Button
                        startIcon={<EditOutlinedIcon />}
                        variant="outlined"
                        onClick={() => startEditing("personal")}
                      >
                        Edit info
                      </Button>
                    )}
                  </Box>

                  <Divider />

                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel shrink>First name</InputLabel>
                        <OutlinedInput
                          label="First name"
                          name="FirstName"
                          value={formData?.FirstName || ""}
                          onChange={handleInputChange}
                          readOnly={editSection !== "personal"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel shrink>Last name</InputLabel>
                        <OutlinedInput
                          label="Last name"
                          name="LastName"
                          value={formData?.LastName || ""}
                          onChange={handleInputChange}
                          readOnly={editSection !== "personal"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12}>
                      <FormControl fullWidth disabled>
                        <InputLabel shrink>Email address</InputLabel>
                        <OutlinedInput
                          label="Email address"
                          value={email}
                          startAdornment={
                            <InputAdornment position="start">
                              <EmailOutlinedIcon fontSize="small" />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <SecurityOutlinedIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Security
                        </Typography>
                      </Stack>
                    </Box>
                    {editSection === "security" ? (
                      <Stack direction="row" spacing={1.5}>
                        <Button color="inherit" variant="text" onClick={cancelEditing}>
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={savePassword}
                          disabled={savingSection === "security"}
                        >
                          {savingSection === "security" ? "Saving..." : "Save password"}
                        </Button>
                      </Stack>
                    ) : (
                      <Button
                        startIcon={<EditOutlinedIcon />}
                        variant="outlined"
                        onClick={() => startEditing("security")}
                      >
                        Change password
                      </Button>
                    )}
                  </Box>

                  <Divider />

                  <FormControl fullWidth>
                    <InputLabel shrink>Password</InputLabel>
                    <OutlinedInput
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={
                        editSection === "security"
                          ? passwordDraft
                          : "********"
                      }
                      onChange={(e) => setPasswordDraft(e.target.value)}
                      readOnly={editSection !== "security"}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ minWidth: "auto", p: 0, color: "text.secondary" }}
                          >
                            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                          </Button>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
