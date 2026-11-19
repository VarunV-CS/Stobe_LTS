import React from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import Chart from "react-apexcharts";

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
    labels,
    legend: {
      show: false,
      // Only matters if you turn the legend on: navigate instead of hiding the slice
      onItemClick: { toggleDataSeries: !onSliceClick },
    },
    chart: {
      toolbar: {
        show: true,
        export: {
          png: { filename: `${title || "Pie Chart"}` },
          svg: { filename: `${title || "Pie Chart"}` },
          csv: { filename: `${title || "Pie Chart"}` },
        },
      },
      events: {
        // Click on a slice
        dataPointSelection: (_event, _chartContext, config) => {
          const i = config?.dataPointIndex;
          if (typeof i === "number" && i >= 0) clickRef.current?.(i);
        },
        // Click on a legend item (only fires if the legend is shown)
        legendClick: (_chartContext, seriesIndex) => {
          if (typeof seriesIndex === "number" && seriesIndex >= 0) {
            clickRef.current?.(seriesIndex);
          }
        },
      },
    },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: "none" } } },
  };

  return (
    <Grid item lg={4} md={6} xs={12}>
      <Card sx={{ p: 2, borderRadius: "10px", boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {hasData ? (
          <Box
            sx={{
              "& .apexcharts-pie-area": {
                cursor: onSliceClick ? "pointer" : "default",
              },
            }}
          >
            <Chart
              options={options}
              series={chartSeries.map(Number)}
              type="pie"
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

        {onViewMore && (
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: "primary.main",
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
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

export default PieChartGridItem;