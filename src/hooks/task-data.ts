
// Centralized mock data for tasks and teams

export const mockTeams = [
  {
    id: "team1",
    name: "Design Team",
    members: 12,
    color: "#6366f1",
    initials: "DT",
  },
  {
    id: "team2",
    name: "Development Team",
    members: 8,
    color: "#10b981",
    initials: "DT",
  },
  {
    id: "team3",
    name: "Marketing Crew",
    members: 5,
    color: "#f59e0b",
    initials: "MC",
  },
  {
    id: "team4",
    name: "Support Squad",
    members: 6,
    color: "#ef4444",
    initials: "SS",
  },
];

export const mockTasks = [
  {
    id: "task1",
    title: "Design Homepage",
    description: "Create wireframes for new homepage layout",
    status: "Todo",
    first_name: "Design",
    last_name: "Task",
    color: "#6366f1",
    teamId: "team1",
  },
  {
    id: "task2",
    title: "API Integration",
    description: "Connect backend to frontend for user auth",
    status: "InProgress",
    first_name: "API",
    last_name: "Task",
    color: "#10b981",
    teamId: "team2",
  },
  {
    id: "task3",
    title: "Bug Fixes",
    description: "Resolve issues in payment module",
    status: "Done",
    first_name: "Bug",
    last_name: "Fix",
    color: "#f59e0b",
    teamId: "team1",
  },
];

export type Team = (typeof mockTeams)[0];
export type Task = (typeof mockTasks)[0];
