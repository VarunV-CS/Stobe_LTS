import React from "react";
import PropTypes from "prop-types";
import { Box, Card, Grid, Skeleton } from "@mui/material";
import { grey } from "@mui/material/colors";

const SkeletonCard = ({ height = 96 }) => (

  <Card
    sx={{
      padding: "16px",
      flex: 1,
      minHeight: height,
      display: "flex",
      alignItems: "center",
      gap: 2,
      boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
    }}
  >
    <Box
      sx={{
        backgroundColor: grey[300],
        borderRadius: "50%",
        p: 2,
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Skeleton variant="circular" width={36} height={36} />
    </Box>
    <Box sx={{ width: "100%" }}>
      <Skeleton width="60%" height={28} />
      <Skeleton width="45%" height={16} sx={{ mt: 0.75 }} />
    </Box>
  </Card>
);

SkeletonCard.propTypes = {
  height: PropTypes.number,
};

const DashboardSkeleton = () => {
  return (

    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(auto-fit, minmax(280px, 1fr))" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </Box>
      </Grid>

      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, minHeight: 220 }}>
            <Skeleton variant="text" width="70%" height={28} />
            <Skeleton variant="rectangular" height={160} sx={{ mt: 1 }} />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, minHeight: 220 }}>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="rectangular" height={160} sx={{ mt: 1 }} />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, minHeight: 260 }}>
            <Skeleton variant="text" width="55%" height={28} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 1 }} />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, minHeight: 260 }}>
            <Skeleton variant="text" width="65%" height={28} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 1 }} />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardSkeleton;

