import React from 'react';
import Chart from 'react-apexcharts';
import { Grid, Card, Typography, Box } from '@mui/material';

const BarChartComponent = ({ data = [], labels = [], title = 'Bar Chart', onViewMore, height = 300 }) => {
  const getColorsByLabels = (labels) => {
  const colorMap = {
    'Amber': '#FF9800',
    'Green': '#4CAF50',
    'Shortlisted': '#2196F3',
    'Rejected': '#F44336',
    'Unassigned': '#9E9E9E'
  };
  return labels.map(label => {
    const key = label.trim();
    return colorMap[key] || `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  });
};


  const chartOptions = {
    chart: {
      type: 'bar',
      height: height,
      toolbar: { 
        show: true,
        export: {
          png: { filename: `${title || 'chart'}` },
          svg: { filename: `${title || 'chart'}` },
          csv: { filename: `${title || 'chart'}` }
        }
      },
    },
    colors: getColorsByLabels(labels),
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: val => `${val}`
      }
    },
    legend: {
      show: false
    },
    grid: {
      borderColor: '#eee'
    }
  };

  const series = [{
    name: 'Count',
    data: data
  }];

  return (
    <Grid item lg={4} md={6} xs={12}>
      <Card sx={{ p: 2, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
        <Chart options={chartOptions} series={series} type="bar" />
        {onViewMore && (
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline' }
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
};

export default BarChartComponent;
