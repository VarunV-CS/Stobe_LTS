import React, { useState } from "react";
import { Tabs, Tab, Box, Paper, CircularProgress } from "@mui/material";
import Clients from "./Clients";
import Roles from "./Roles";

const ClientRoles = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setLoading(true);
    setActiveTab(newValue);
    
    // Reset loading after a short delay
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <Box sx={{ width: "100%", mx: "auto", mt: 3 }}>
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTab-root': {
              minWidth: 120,
              fontWeight: 'medium',
            },
          }}
        >
          <Tab label="Clients" />
          <Tab label="Roles" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2, minHeight: '400px', position: 'relative' }}>
        {loading ? (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        ) : null}
        
        <Box sx={{ opacity: loading ? 0.5 : 1 }}>
          {activeTab === 0 ? <Clients /> : <Roles />}
        </Box>
      </Box>
    </Box>
  );
};

export default ClientRoles;
