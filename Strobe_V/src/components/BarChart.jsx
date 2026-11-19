import React from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

import { Grid, Card, Typography, Box } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const COLOR_MAP = {
  Amber: '#feb019',
  Green: '#05e395',
  Shortlisted: '#038ffb',
  Rejected: '#ff455f',
  Unassigned: '#775dcf',
};

const PREDEFINED_COLORS = ['#038ffb', '#05e395', '#ff455f', '#775dcf', '#feb019'];

const getColorsByLabels = (labels) =>
  labels.map((label, index) => {
    const key = String(label ?? '').trim();
    return COLOR_MAP[key] || PREDEFINED_COLORS[index % PREDEFINED_COLORS.length];
  });

/**
 * Props (same as the Dashboard already passes):
 *   data        number[]   values, one per bar
 *   labels      string[]   x-axis labels, one per bar
 *   title       string
 *   onViewMore  () => void
 *   onBarClick  (index: number) => void   index of the clicked bar
 */
const BarChartComponent = ({
  data = [],
  labels = [],
  title = 'Bar Chart',
  onViewMore,
  onBarClick,
  height = 300,
}) => {
  const { mode } = useTheme();

  // Always call the latest handler. react-apexcharts doesn't reliably
  // re-bind chart events when only a callback prop changes.
  const clickRef = React.useRef(onBarClick);
  clickRef.current = onBarClick;

  const axisLabelColor = mode === 'dark' ? '#e5e7eb' : '#111827';
  const gridBorderColor = mode === 'dark' ? 'rgba(229, 231, 235, 0.15)' : '#e5e7eb';

  const chartOptions = {
    chart: {
      type: 'bar',
      height: height,
      toolbar: {
        show: true,
        export: {
          png: { filename: `${title || 'chart'}` },
          svg: { filename: `${title || 'chart'}` },
          csv: { filename: `${title || 'chart'}` },
        },
      },
      events: {
        // For bar charts `click` is the reliable event: it carries the
        // dataPointIndex of the bar under the cursor (dataPointSelection
        // often doesn't fire on bars with the default shared tooltip).
        click: (event, _chartContext, config) => {
          // Ignore clicks on the toolbar and its download menu, so choosing
          // PNG / SVG / CSV never counts as a bar click.
          if (event?.target?.closest?.('.apexcharts-toolbar, .apexcharts-menu')) return;
          const i = config?.dataPointIndex;
          if (typeof i === 'number' && i >= 0) clickRef.current?.(i);
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          fontSize: '12px',
          colors: axisLabelColor,
        },
      },
      axisBorder: {
        show: true,
        color: gridBorderColor,
      },
      axisTicks: {
        show: true,
        color: gridBorderColor,
      },
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: axisLabelColor,
        },
      },
      labels: {
        style: {
          colors: axisLabelColor,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: mode === 'dark' ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        background: mode === 'dark' ? '#111827' : '#ffffff',
        color: mode === 'dark' ? '#e5e7eb' : '#111827',
      },
      y: {
        formatter: (val) => `${val}`,
      },
    },
    colors: getColorsByLabels(labels),
    legend: {
      show: false,
    },
    grid: {
      borderColor: '#eee',
    },
    // Don't darken a bar after it's clicked; we navigate instead
    states: { active: { filter: { type: 'none' } } },
    noData: { text: 'No data yet' },
  };

  const series = [
    {
      name: 'Count',
      data: data,
    },
  ];

  return (
    <Grid item lg={4} md={6} xs={12}>
      <Card sx={{ p: 2, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>

        <Box
          sx={{
            '& .apexcharts-bar-area': {
              cursor: onBarClick ? 'pointer' : 'default',
            },
          }}
        >
          <Chart options={chartOptions} series={series} type="bar" />
        </Box>

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
                '&:hover': { textDecoration: 'underline' },
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

BarChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  onViewMore: PropTypes.func,
  onBarClick: PropTypes.func, // receives the index of the clicked bar
  height: PropTypes.number,
};

export default BarChartComponent;