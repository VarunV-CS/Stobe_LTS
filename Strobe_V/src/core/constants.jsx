import { ChartPie as ChartPieIcon } from "@phosphor-icons/react/dist/ssr/ChartPie";
import { GearSix as GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix";
import { PlugsConnected as PlugsConnectedIcon } from "@phosphor-icons/react/dist/ssr/PlugsConnected";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { XSquare } from "@phosphor-icons/react/dist/ssr/XSquare";
import { FileText  } from "@phosphor-icons/react/dist/ssr/FileText";

export const BASE_URL = 'http://167.172.164.218/'

export const navIcons = {
  "chart-pie": ChartPieIcon,
  "gear-six": GearSixIcon,
  "plugs-connected": PlugsConnectedIcon,
  "x-square": XSquare,
  user: UserIcon,
  users: UsersIcon,
  "FileText": FileText,
};

export const navItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: "chart-pie",
  },
  {
    key: "candidates",
    title: "Candidates",
    href: "/candidates",
    icon: "users",
  },
  {
    key: "profile",
    title: "Profile",
    href: "/profile",
    icon: "user",
  },
  {
    key: "ClientRoles",
    title: "Client And Roles",
    href: "/ClientRoles",
    icon: "FileText",
  },
  {
    key: "Template",
    title: "Template",
    href: "/Template",
    icon: "FileText",
  },
];

export const Rag = [
  { value: "Amber", label: "Amber" },
  { value: "Green", label: "Green" },
  { value: "Red", label: "Red" },
];
export const Relocate = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Already here", label: "Already In The City" },
];
export const currency = [
  { value: "INR", label: "INR" },
  { value: "USD", label: "USD" },
  { value: "ZAR", label: "ZAR" },
];
export const payment = [
  { value: "Hourly", label: "HOURLY" },
  { value: "Monthly", label: "MONTHLY" },
  { value: "Yearly", label: "YEARLY" },
];
export const workingModel = [
  { value: "Any", label: "Any" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Remote", label: "Remote" },
];
export const status = [
  { value: "", label: "Blank" },
  { value: "Shortlisted", label: "Shortlisted" },
  { value: "InterviewScheduled", label: "Interview Scheduled" },
  { value: "talentPool", label: "Talent pool" },
  { value: "SubmittedToClient", label: "Submitted To Client" },
  { value: "AwaitingFeedback", label: "Awaiting Feedback" },
  { value: "Recruit", label: "Recruit" },
  { value: "Reject", label: "Reject" },
  { value: "Hired", label: "Hired" },
];
