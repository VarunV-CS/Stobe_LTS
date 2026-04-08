import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

const CandidatesDashboardCard = ({ count }) => {
  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#fff',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'primary.main',
          borderRadius: '50%',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UsersIcon fontSize="var(--icon-fontSize-lg)" color="white" />
      </Box>
      <Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {count}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          New Candidates (Last 30 Days)
        </Typography>
      </Box>
    </Card>
  );
};

export default CandidatesDashboardCard; 