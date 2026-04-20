import React from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
} from "@mui/material";
import Chart from "react-apexcharts";

const PieChartGridItem = ({ chartSeries, labels, title, onViewMore }) => (
  <Grid item lg={4} md={6} xs={12}>
    <Card sx={{ p: 2, borderRadius: "10px", boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Chart
        options={{
          labels,
          legend: { 
            show: false 
          },
          chart: {
            toolbar: {
              show: true,
              export: {
                png: { filename: `${title || 'Pie Chart'}` },
                svg: { filename: `${title || 'Pie Chart'}` },
                csv: { filename: `${title || 'Pie Chart'}` }
              }
            }
          }
        }}
        series={chartSeries}
        type="pie"
        height={300}
      />
      {onViewMore && (
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography 
            variant="body2" 
            component="span"
            sx={{ 
              color: 'primary.main', 
              cursor: 'pointer',
              fontWeight: 500,
              '&amp;:hover': { textDecoration: 'underline' }
            }}
            onClick={onViewMore}
          >
            View more →
          </Typography>
        </Box>
      )}
    </Card>
  </Grid>
);

export default PieChartGridItem;
