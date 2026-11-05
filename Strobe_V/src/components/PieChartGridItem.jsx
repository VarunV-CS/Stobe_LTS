import React from "react";
import Chart from "react-apexcharts";
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";

/**
 * Props (same as the Dashboard already passes):
 *   chartSeries   number[]   values, one per slice
 *   labels        string[]   slice names, one per slice
 *   title         string
 *   onViewMore    () => void
 *   onSliceClick  (index: number) => void   index of the clicked slice
 */
const PieChartGridItem = ({
  chartSeries = [],
  labels = [],
  title,
  onViewMore,
  onSliceClick,
  height = 300,
}) => {
  // Always call the latest handler. react-apexcharts doesn't reliably
  // re-bind chart events when only a callback prop changes.
  const clickRef = React.useRef(onSliceClick);
  clickRef.current = onSliceClick;

  const hasData = chartSeries.some((v) => Number(v) > 0);

  const options = {
    chart: {
      type: "pie",
      events: {
        // Click on a slice
        dataPointSelection: (_event, _chartContext, config) => {
          const i = config?.dataPointIndex;
          if (typeof i === "number" && i >= 0) clickRef.current?.(i);
        },
        // Click on a legend item: handy for tiny slices that are hard to hit
        legendClick: (_chartContext, seriesIndex) => {
          if (typeof seriesIndex === "number" && seriesIndex >= 0) {
            clickRef.current?.(seriesIndex);
          }
        },
      },
    },
    labels,
    legend: {
      position: "bottom",
      // don't hide the slice when its legend item is clicked; we navigate instead
      onItemClick: { toggleDataSeries: !onSliceClick },
    },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: "none" } } },
  };

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{ height: "100%", boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6">{title}</Typography>
            {onViewMore && (
              <Button size="small" onClick={onViewMore}>
                View more
              </Button>
            )}
          </Box>

          {hasData ? (
            <Box
              sx={{
                "& .apexcharts-pie-area, & .apexcharts-legend-series": {
                  cursor: onSliceClick ? "pointer" : "default",
                },
              }}
            >
              <Chart
                type="pie"
                options={options}
                series={chartSeries.map(Number)}
                height={height}
              />
            </Box>
          ) : (
            <Box
              sx={{
                height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No data yet
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PieChartGridItem;
