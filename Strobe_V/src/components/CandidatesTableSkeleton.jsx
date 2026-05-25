import React from "react";
import {
  Box,
  Card,
  Divider,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

const CandidatesTableSkeleton = ({ rowsPerPage = 25, rows = 8 }) => {
  const skeletonRows = Math.max(1, Math.min(rowsPerPage, rows));

  return (
    <Card
      sx={{
        backgroundColor: "transparent",
        boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: "800px" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton width={120} />
              </TableCell>
              <TableCell>
                <Skeleton width={120} />
              </TableCell>
              <TableCell>
                <Skeleton width={140} />
              </TableCell>
              <TableCell>
                <Skeleton width={160} />
              </TableCell>
              <TableCell>
                <Skeleton width={90} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} />
              </TableCell>
              <TableCell>
                <Skeleton width={110} />
              </TableCell>
              <TableCell>
                <Skeleton width={100} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, idx) => (
              <TableRow hover key={idx}>
                <TableCell>
                  <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
                    <Skeleton width="75%" />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
                    <Skeleton width="75%" />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Skeleton width="60%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="70%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="50%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="45%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="55%" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="circular" width={28} height={28} />
                    <Skeleton variant="circular" width={28} height={28} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Divider />
      <TablePagination
        component="div"
        count={0}
        page={0}
        rowsPerPage={rowsPerPage}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default CandidatesTableSkeleton;

