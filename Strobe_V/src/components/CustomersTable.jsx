import React from "react";
import EditActionButton from './EditActionButton';
import DeleteActionButton from './DeleteActionButton';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { Button } from "@mui/material";

import { useNavigate } from "react-router";
import axios from "axios";
const CustomersTable = ({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const navigate = useNavigate();
  const EditHandler = (id) => {
    navigate(`/candidates/${id}`);
  };
 
  const deleteCandidate = async (id) => {
    try {
      await axios.delete(`http://167.172.164.218/candidates/deleteById/${id}`);
      // Optionally, refresh your data here (e.g., call a prop function or re-fetch data)
      console.log(`Candidate with id ${id} deleted successfully`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };
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
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Current Role</TableCell>
              <TableCell>Expected Role</TableCell>
              {/* <TableCell>Currency</TableCell>
             
              <TableCell>PaymentType</TableCell> */}
              <TableCell>Status</TableCell>
              <TableCell>RAG</TableCell>
              <TableCell>Created AT</TableCell>
              {/* <TableCell>clientsInterviewDate</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover key={row._id}>
                  <TableCell>
                    <Stack
                      sx={{ alignItems: "center" }}
                      direction="row"
                      spacing={2}
                    >
                      <Typography>{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack
                      sx={{ alignItems: "center" }}
                      direction="row"
                      spacing={2}
                    >
                      <Typography>{row.surName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.currentRole}</TableCell>
                  <TableCell>{row.expectedRole}</TableCell>

                  {/* <TableCell>{row.currency}</TableCell>
                  <TableCell>{row.expectedCTC}</TableCell>
                  <TableCell>{row.paymentType}</TableCell> */}
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.internalRAG}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                  {/* <TableCell>
                    {dayjs(row.createdAt).format("MMM D, YYYY")}
                  </TableCell> */}
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    <EditActionButton onClick={() => EditHandler(row._id)} />
    <DeleteActionButton itemId={row._id} itemName={`${row.name.trim()} ${row.surName.trim()}`.trim()} onConfirmFn={() => deleteCandidate(row._id)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default CustomersTable;
