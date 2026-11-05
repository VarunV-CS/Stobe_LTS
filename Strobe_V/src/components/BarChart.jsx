import React from "react";
import Chart from "react-apexcharts";
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";

/**
 * Props (same as the Dashboard already passes):
 *   data        number[]   values, one per bar
 *   labels      string[]   x-axis labels, one per bar
 *   title       string
 *   onViewMore  () => void
 *   onBarClick  (index: number) => void   index of the clicked bar
 */
const BarChart = ({
  data = [],
  labels = [],
  title,
  onViewMore,
  onBarClick,
  height = 300,
}) => {
  // Always call the latest handler. react-apexcharts doesn't reliably
  // re-bind chart events when only a callback prop changes.
  const clickRef = React.useRef(onBarClick);
  clickRef.current = onBarClick;

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      events: {
        // For bar charts `click` is the reliable event: it carries the
        // dataPointIndex of the bar under the cursor (dataPointSelection
        // often doesn't fire on bars with the default shared tooltip).
        click: (_event, _chartContext, config) => {
          const i = config?.dataPointIndex;
          if (typeof i === "number" && i >= 0) clickRef.current?.(i);
        },
      },
    },
    plotOptions: {
      bar: { distributed: true, borderRadius: 4, columnWidth: "50%" },
    },
    xaxis: { categories: labels },
    dataLabels: { enabled: true },
    legend: { show: false },
    states: { active: { filter: { type: "none" } } },
    noData: { text: "No data yet" },
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

          <Box
            sx={{
              "& .apexcharts-bar-area": {
                cursor: onBarClick ? "pointer" : "default",
              },
            }}
          >
            <Chart
              type="bar"
              options={options}
              series={[{ name: title || "Count", data }]}
              height={height}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BarChart;
