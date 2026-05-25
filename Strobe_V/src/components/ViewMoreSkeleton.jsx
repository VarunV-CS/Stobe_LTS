import React from "react";
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const ViewMoreSkeleton = ({ rows = 5 }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Skeleton width={120} />
            </TableCell>
            <TableCell align="right">
              <Skeleton width={70} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton width="80%" />
              </TableCell>
              <TableCell align="right">
                <Skeleton width={60} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewMoreSkeleton;

