import React from "react";
import { Box, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const RoleCandidatesSkeleton = ({ rows = 6 }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Skeleton width={120} />
            </TableCell>
            <TableCell>
              <Skeleton width={100} />
            </TableCell>
            <TableCell>
              <Skeleton width={120} />
            </TableCell>
            <TableCell>
              <Skeleton width={140} />
            </TableCell>
            <TableCell>
              <Skeleton width={90} />
            </TableCell>
            <TableCell>
              <Skeleton width={120} />
            </TableCell>
            <TableCell align="right">
              <Skeleton width={100} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton width="80%" />
              </TableCell>
              <TableCell>
                <Skeleton width="90%" />
              </TableCell>
              <TableCell>
                <Skeleton width="70%" />
              </TableCell>
              <TableCell>
                <Skeleton width={90} />
              </TableCell>
              <TableCell>
                <Skeleton width={60} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} />
              </TableCell>
              <TableCell align="right">
                <Skeleton width={90} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default RoleCandidatesSkeleton;

