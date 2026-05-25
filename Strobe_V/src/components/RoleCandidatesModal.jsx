import React from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import RoleCandidatesSkeleton from "./RoleCandidatesSkeleton";
import CloseIcon from "@mui/icons-material/Close";

const RoleCandidatesModal = ({
  open,
  onClose,
  title,
  candidates = [],
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 850,
          maxHeight: "80vh",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <RoleCandidatesSkeleton rows={6} />
        ) : (

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Candidate</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Current Role</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Internal RAG</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Created At</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? null : (
                  <>
                    {candidates.map((c) => (
                      <TableRow key={c._id || c.candidateID}>
                        <TableCell>{c.name || "-"}</TableCell>
                        <TableCell>{c.email || "-"}</TableCell>
                        <TableCell>{c.currentRole || "-"}</TableCell>
                        <TableCell>{c.status || "-"}</TableCell>
                        <TableCell>{c.internalRAG || "-"}</TableCell>
                        <TableCell align="right">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                      </TableRow>
                    ))}

                    {candidates.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No candidates found for this role.
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Modal>
  );
};

export default RoleCandidatesModal;

