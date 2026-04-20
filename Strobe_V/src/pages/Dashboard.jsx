import React, { useCallback, useEffect, useState, useRef } from "react";
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
import ViewMoreModal from "../components/ViewMoreModal";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import PieChartGridItem from "../components/PieChartGridItem";



const SummaryCard = ({ title, value, icon: Icon, color = "primary" }) => (
  <Card
    sx={{
      padding: "16px",
      flex: 1,
      minHeight: '100%',
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
  const [viewMoreOpen, setViewMoreOpen] = useState(false);
  const [viewMoreData, setViewMoreData] = useState([]);
  const [viewMoreTitle, setViewMoreTitle] = useState('');
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
  
  
        // console.log('candidatesByClient:', candidatesByClient);
        // console.log('roleStatusPieData:', roleStatusPieData)
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
<Grid item xs={12}>
  <Box sx={{ 
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(280px, 1fr))' },
    gap: 2,
    alignItems: 'start'
  }}>
    <SummaryCard
      title="Active Candidates"
      value={dashboardData.activeCandidates}
      icon={UsersIcon}
    />
    <SummaryCard
      title="Green Candidates"
      value={dashboardData.greenCandidates}
      icon={UsersIcon}
      color="success"
    />
    <SummaryCard
      title="Amber Candidates"
      value={dashboardData.amberCandidates}
      icon={UsersIcon}
      color="warning"
    />
    <SummaryCard
      title="New Candidates (Last 30 Days)"
      value={dashboardData.recentCandidates}
      icon={UsersIcon}
      color="info"
    />
  </Box>
</Grid>

      {/* Bar Graphs */}
      <Grid item xs={12} container spacing={2}>
      {/* 1st Pie Chart - Candidate Status Distribution 
      
      <PieChartGridItem
      chartSeries={[ dashboardData.amberCandidates, dashboardData.greenCandidates]}
      labels={["Amber","Green" ]}
      title="Candidate Status Distribution"
      onViewMore={() => setSelectedModal('status')}
      /> */}

<BarChart
          data={[dashboardData.amberCandidates, dashboardData.greenCandidates]}
          labels={["Amber", "Green"]}
          title="Candidate Status Distribution"
          onViewMore={() => {
            setViewMoreData([
              { label: 'Amber Candidates', count: dashboardData.amberCandidates },
              { label: 'Green Candidates', count: dashboardData.greenCandidates }
            ]);
            setViewMoreTitle('Status Distribution Details');
            setViewMoreOpen(true);
          }}
      />

  <BarChart
    data={[dashboardData.shortlistedCandidates, dashboardData.rejectedCandidates]}
    labels={["Shortlisted", "Rejected"]}
    title="Candidate Selection Status"
    onViewMore={() => {
      setViewMoreData([
        { label: 'Shortlisted', count: dashboardData.shortlistedCandidates },
        { label: 'Rejected', count: dashboardData.rejectedCandidates }
      ]);
      setViewMoreTitle('Selection Status Details');
      setViewMoreOpen(true);
    }}
  />
  <BarChart
    data={roleCounts.map((r) => r.count)}
    labels={roleCounts.map((r) => r.label)}
    title="Active Roles Distribution"
    onViewMore={() => {
      setViewMoreData(roleCounts);
      setViewMoreTitle('Active Roles Details');
      setViewMoreOpen(true);
    }}
  />
<BarChart
    data={candidatesByRole.map((r) => r.count)}
    labels={candidatesByRole.map((r) => r.label)}
    title="Candidates per Role"
    onViewMore={() => {
      setViewMoreData(candidatesByRole);
      setViewMoreTitle('Candidates per Role Details');
      setViewMoreOpen(true);
    }}
  />

<BarChart
  data={candidatesByClient.map((r) => r.count)}
  labels={candidatesByClient.map((r) => r.label)}
  title="Candidates by Client"
  onViewMore={() => {
    setViewMoreData(candidatesByClient);
    setViewMoreTitle('Candidates by Client Details');
    setViewMoreOpen(true);
  }}
 />
<BarChart
  data={roleStatusPieData.map((data) => data.greenCount)}
  labels={roleStatusPieData.map((data) => data.role)}
  title="Role-Based Green Candidates"
  onViewMore={() => {
    setViewMoreData(roleStatusPieData.map(data => ({ label: data.role, count: data.greenCount })));
    setViewMoreTitle('Green Candidates by Role Details');
    setViewMoreOpen(true);
  }}
 />

  <PieChartGridItem
    chartSeries={roleStatusPieData.map((data) => data.amberCount)}
    labels={roleStatusPieData.map((data) => data.role)}
    title="Role-Based Amber Candidates"
    onViewMore={() => {
      setViewMoreData(roleStatusPieData.map(data => ({ label: data.role, count: data.amberCount })));
      setViewMoreTitle('Amber Candidates by Role Details');
      setViewMoreOpen(true);
    }}
  />
  </Grid>
  
  <PieChart
        chartSeries={roleStatusPieData.map((data) => data.redCount)}
        labels={roleStatusPieData.map((data) => data.role)}
        title="Role-Based Red Candidates"
        onViewMore={() => {
          setViewMoreData(roleStatusPieData.map(data => ({ label: data.role, count: data.redCount })));
          setViewMoreTitle('Red Candidates by Role Details');
          setViewMoreOpen(true);
        }}
  />

  <ViewMoreModal
    open={viewMoreOpen}
    title={viewMoreTitle}
    data={viewMoreData}
    onClose={() => setViewMoreOpen(false)}
  />

      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default Dashboard;
