import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { GearSix as GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix";
import { SignOut as SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { useNavigate } from "react-router";
import { use } from "react";
import { AuthContext } from "./AuthContext";

const UserPopover = ({ anchorEl, onClose, open }) => {
  const navigate = useNavigate();
  const {currentUser} = React.useContext(AuthContext)

  const handleSignOut = React.useCallback(async () => {
    try {
      localStorage.removeItem("authData");
      navigate("/login");
    } catch (err) {
      console.error("Sign out error", err);
    }
  }, []);

  const handleNavigate = () => {
    navigate('/profile')
    onClose()
  }

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: "240px" } } }}
    >
      <Box sx={{ p: "16px 20px " }}>
        <Typography variant="subtitle1">{currentUser.FirstName}</Typography>
        <Typography color="text.secondary" variant="body2">
          {currentUser.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        sx={{ p: "8px", "& .MuiMenuItem-root": { borderRadius: 1 } }}
      >
        {/* <MenuItem
          //   component={RouterLink}
          //   href={paths.dashboard.settings}
          onClick={onClose}
        >
          <ListItemIcon>
            <GearSixIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem
          //   component={RouterLink}
            href=''
          onClick={handleNavigate}
        >
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

export default UserPopover;
