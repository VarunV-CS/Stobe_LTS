import React, { lazy, Suspense } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

import Typography from "@mui/material/Typography";

import { Desktop as DesktopIcon } from "@phosphor-icons/react/dist/ssr/Desktop";
import { DeviceTablet as DeviceTabletIcon } from "@phosphor-icons/react/dist/ssr/DeviceTablet";
import { Phone as PhoneIcon } from "@phosphor-icons/react/dist/ssr/Phone";
const iconMapping = {
  Desktop: DesktopIcon,
  Tablet: DeviceTabletIcon,
  Phone: PhoneIcon,
};

const ApexChart = lazy(() => import("react-apexcharts"));

export const Chart = styled(ApexChart)``;

const PieChart = ({ chartSeries, labels, sx, title = "Pie Chart", onViewMore }) => {
  const chartOptions = useChartOptions(labels);
  return (
    <Card sx={sx}>
<CardHeader title={title} />
      <CardContent>
        <Stack spacing={2}>
          <Chart
            height={300}
            options={chartOptions}
            series={chartSeries}
            type="pie"
            width="100%"
          />
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            {chartSeries.map((item, index) => {
              const label = labels[index];
              const Icon = iconMapping[label];

              return (
                <Stack key={label} spacing={1} sx={{ alignItems: "center" }}>
                  {Icon ? <Icon fontSize="var(--icon-fontSize-lg)" /> : null}
                  <Typography variant="h6">{label}</Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    {item}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        {/* {onViewMore && (
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={onViewMore}
            >
              View more →
            </Typography>
          </Box>
        )} */}
      </CardContent>
    </Card>
  );
};

function useChartOptions(labels) {
  const theme = useTheme();
  // console.log(theme.palette.secondary["100"]);

  return {
    chart: { background: "transparent" },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.secondary['500'],
    ],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: {
      active: { filter: { type: "none" } },
      hover: { filter: { type: "none" } },
    },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}

export default PieChart;
