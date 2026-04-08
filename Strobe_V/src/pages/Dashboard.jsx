import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Alert,
  Card,
  Box,
} from "@mui/material";
import axios from "axios";
import UsersIcon from "@mui/icons-material/Group"; // Adjust if you're using custom icons
import Chart from "react-apexcharts";
import { Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const PieChartGridItem = ({ chartSeries, labels, title, onViewMore }) => (
  <Grid item lg={4} md={6} xs={12}>
    <Card sx={{ p: 2, borderRadius: "10px", boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Chart
        options={{
          labels,
          legend: { 
            show: false 
          },
        }}
        series={chartSeries}
        type="pie"
        height={300}
      />
      {onViewMore && (
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
      )}
    </Card>
  </Grid>
);

const SummaryCard = ({ title, value, icon: Icon, color = "primary" }) => (
  <Card
    sx={{
      padding: "16px",
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: 2,
      boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
    }}
  >
    <Box
      sx={{
        backgroundColor: `${color}.main`,
        borderRadius: "50%",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon fontSize="large" sx={{ color: "#fff" }} />
    </Box>
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Box>
  </Card>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    activeCandidates: 0,
    greenCandidates: 0,
    amberCandidates: 0,
    shortlistedCandidates: 0,
    rejectedCandidates: 0,
    recentCandidates: 0,
  });

  const [roleCounts, setRoleCounts] = useState([]);
  const [candidatesByRole, setCandidatesByRole] = useState([]);
const [roleStatusPieData, setRoleStatusPieData] = useState([]);
  const [candidatesByClient, setCandidatesByClient] = useState([]);
  const [selectedModal, setSelectedModal] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
  
      const [dashboardRes, candidatesRes, rolesRes, clientsRes] = await Promise.all([
        axios.get("http://167.172.164.218/candidates/dashboard"),
        axios.get("http://167.172.164.218/candidates/get1"),
        axios.get("http://167.172.164.218/roles/get"),
        axios.get("http://167.172.164.218/client/get"),
      ]);

      const allClients = clientsRes.data || [];
      const clientMap = {};
      allClients.forEach((client) => {
        clientMap[client._id] = client.name;
      });
  
      if (dashboardRes.data.success) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
const allCandidates = candidatesRes.data?.data || [];
const allRoles = rolesRes.data || [];
  const activeRoles = allRoles.filter(role => role.status === 'Active');
  
        // Recent Candidates
        const recentCandidates = allCandidates.filter(
          (c) => new Date(c.createdAt) >= thirtyDaysAgo
        ).length;
  
        // Role counts from roles API (active only)
        const roleMap = {};
        activeRoles.forEach((role) => {
          roleMap[String(role.roleName || "").trim().toLowerCase()] = (roleMap[String(role.roleName || "").trim().toLowerCase()] || 0) + 1;
        });
  
        // Candidates by Role
        const candidateMap = {};
        allCandidates.forEach((c) => {
          const role = String(c.expectedRole || "Unassigned").trim().toLowerCase();
          if (roleMap[role]) {
            candidateMap[role] = (candidateMap[role] || 0) + 1;
          }
        });
  
        // Prepare Role-InternalRAG Data
        const roleStatusData = {};
        const roleNames = new Set(allRoles.map((r) => String(r.roleName || "").trim().toLowerCase()));

        allCandidates.forEach((c) => {
          const role = String(c.expectedRole || "Unassigned").trim().toLowerCase();
          const rag = String(c.internalRAG || "Unassigned");
  
          if (roleNames.has(role)) {
            const key = `${role}-${rag}`;
            roleStatusData[key] = (roleStatusData[key] || 0) + 1;
          }
        });
  console.log("#!@@##$##########",roleStatusData)
        // Format Role Status Pie Data
        const roleStatusPieData = Object.entries(roleStatusData).reduce((acc, [key, count]) => {
          const [role, rag] = key.split("-");
  
          if (!acc[role]) acc[role] = { Green: 0, Amber: 0, Red: 0, Unassigned: 0 };
          acc[role][rag] = count;
  
          return acc;
        }, {});
  
        const formattedPieData = Object.entries(roleStatusPieData).map(([role, rags]) => ({
          role,
          greenCount: rags.Green || 0,
          amberCount: rags.Amber || 0,
          redCount: rags.Red || 0,
          unassignedCount: rags.Unassigned || 0,
        }));
  
        setRoleCounts(
          Object.entries(roleMap).map(([label, count]) => ({
            label,
            count,
          }))
        );
  
        setCandidatesByRole(
          Object.entries(candidateMap).map(([label, count]) => ({
            label,
            count,
          }))
        );

        // Candidates by Client
        const clientMapData = {};
        allCandidates.forEach((c) => {
          const clientId = c.clientId;
          if (clientId && clientMap[clientId]) {
            const clientName = clientMap[clientId];
            clientMapData[clientName] = (clientMapData[clientName] || 0) + 1;
          }
        });
        setCandidatesByClient(
          Object.entries(clientMapData).map(([label, count]) => ({
            label,
            count,
          }))
        );
  
        setRoleStatusPieData(formattedPieData);
  
        setDashboardData({
          ...dashboardRes.data.data,
          recentCandidates,
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  
        console.log('candidatesByClient:', candidatesByClient);
        console.log('roleStatusPieData:', roleStatusPieData)
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography>Loading dashboard data...</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Active Candidates"
            value={dashboardData.activeCandidates}
            icon={UsersIcon}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Green Candidates"
            value={dashboardData.greenCandidates}
            icon={UsersIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Amber Candidates"
            value={dashboardData.amberCandidates}
            icon={UsersIcon}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="New Candidates (Last 30 Days)"
            value={dashboardData.recentCandidates}
            icon={UsersIcon}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Pie Charts */}
      <Grid item xs={12} container spacing={2}>
  <PieChartGridItem
    chartSeries={[ dashboardData.amberCandidates, dashboardData.greenCandidates]}
    labels={["Amber","Green" ]}
    title="Candidate Status Distribution"
    onViewMore={() => setSelectedModal('status')}
  />
  <PieChartGridItem
    chartSeries={[dashboardData.shortlistedCandidates, dashboardData.rejectedCandidates]}
    labels={["Shortlisted", "Rejected"]}
    title="Candidate Selection Status"
    onViewMore={() => setSelectedModal('selection')}
  />
  <PieChartGridItem
    chartSeries={roleCounts.map((r) => r.count)}
    labels={roleCounts.map((r) => r.label)}
    title="Active Roles Distribution"
    onViewMore={() => setSelectedModal('roles')}
  />
  <PieChartGridItem
    chartSeries={candidatesByRole.map((r) => r.count)}
    labels={candidatesByRole.map((r) => r.label)}
    title="Candidates per Role"
    onViewMore={() => setSelectedModal('candidatesByRole')}
  />

<PieChartGridItem
  chartSeries={candidatesByClient.map((r) => r.count)}
  labels={candidatesByClient.map((r) => r.label)}
  title="Candidates by Client"
  onViewMore={() => setSelectedModal('candidatesByClientModal')}
 />
<PieChartGridItem
  chartSeries={roleStatusPieData.map((data) => data.greenCount)}
  labels={roleStatusPieData.map((data) => data.role)}
  title="Role-Based Green Candidates"
  onViewMore={() => setSelectedModal('greenByRole')}
 />

  <PieChartGridItem
    chartSeries={roleStatusPieData.map((data) => data.amberCount)}
    labels={roleStatusPieData.map((data) => data.role)}
    title="Role-Based Amber Candidates"
    onViewMore={() => setSelectedModal('amberByRole')}
  />
  </Grid>

  {/* View More Modals - 1st 3 Charts */}
  <Modal
    open={selectedModal !== null}
    onClose={() => setSelectedModal(null)}
    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Box sx={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 600, maxHeight: '80vh', bgcolor: 'background.paper', borderRadius: 2,
      boxShadow: 24, p: 4, overflowY: 'auto'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {selectedModal === 'status' && 'Status Distribution Details'}
          {selectedModal === 'selection' && 'Selection Status Details'}
          {selectedModal === 'roles' && 'Active Roles Details'}
          {selectedModal === 'candidatesByRole' && 'Candidates per Role Details'}
          {selectedModal === 'greenByRole' && 'Green Candidates by Role Details'}
          {selectedModal === 'amberByRole' && 'Amber Candidates by Role Details'}
          {selectedModal === 'candidatesByClientModal' && 'Candidates by Client Details'}
        </Typography>
        <IconButton onClick={() => setSelectedModal(null)}><CloseIcon /></IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell><strong>Category</strong></TableCell><TableCell align="right"><strong>Count</strong></TableCell></TableRow></TableHead>
          <TableBody>
            {selectedModal === 'status' && (
              <>
                <TableRow><TableCell>Amber Candidates</TableCell><TableCell align="right">{dashboardData.amberCandidates}</TableCell></TableRow>
                <TableRow><TableCell>Green Candidates</TableCell><TableCell align="right">{dashboardData.greenCandidates}</TableCell></TableRow>
              </>
            )}
            {selectedModal === 'selection' && (
              <>
                <TableRow><TableCell>Shortlisted</TableCell><TableCell align="right">{dashboardData.shortlistedCandidates}</TableCell></TableRow>
                <TableRow><TableCell>Rejected</TableCell><TableCell align="right">{dashboardData.rejectedCandidates}</TableCell></TableRow>
              </>
            )}
            {selectedModal === 'roles' && roleCounts.map((row) => (
              <TableRow key={row.label}><TableCell>{row.label}</TableCell><TableCell align="right">{row.count}</TableCell></TableRow>
            ))}
            {selectedModal === 'candidatesByRole' && candidatesByRole.map((row) => (
              <TableRow key={row.label}><TableCell>{row.label}</TableCell><TableCell align="right">{row.count}</TableCell></TableRow>
            ))}
            {selectedModal === 'greenByRole' && roleStatusPieData.map((row) => (
              <TableRow key={row.role}><TableCell>{row.role}</TableCell><TableCell align="right">{row.greenCount}</TableCell></TableRow>
            ))}
            {selectedModal === 'amberByRole' && roleStatusPieData.map((row) => (
              <TableRow key={row.role}><TableCell>{row.role}</TableCell><TableCell align="right">{row.amberCount}</TableCell></TableRow>
            ))}
            {selectedModal === 'candidatesByClientModal' && candidatesByClient.map((row) => (
              <TableRow key={row.label}><TableCell>{row.label}</TableCell><TableCell align="right">{row.count}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Modal>

      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default Dashboard;
