const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Sprint = require("../models/Sprint");
const Issue = require("../models/Issue");
const Team = require("../models/Team");

async function seedDatabase() {
  const [userCount, sprintCount, issueCount, teamCount] = await Promise.all([
    User.countDocuments(),
    Sprint.countDocuments(),
    Issue.countDocuments(),
    Team.countDocuments(),
  ]);

  if (userCount + sprintCount + issueCount + teamCount > 0) {
    return;
  }

  const [adminPassword, demoPassword] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("demo123", 10),
  ]);

  const users = await User.insertMany([
    { name: "Alex Rivera", email: "alex@company.com", passwordHash: adminPassword, role: "admin" },
    { name: "Sprint Demo", email: "demo@sprinto.dev", passwordHash: demoPassword, role: "manager" },
  ]);

  const teamMembers = await Team.insertMany([
    { name: "Alex Rivera", email: "alex@company.com", role: "Admin" },
    { name: "Sam Chen", email: "sam@sprinto.dev", role: "Developer" },
    { name: "Priya Mehta", email: "priya@sprinto.dev", role: "Designer" },
  ]);

  const sprint = await Sprint.create({
    name: "Sprint 1",
    goal: "Deliver the backend evaluation upgrade",
    status: "active",
    startDate: "2026-04-19",
    endDate: "2026-04-26",
    startedAt: new Date(),
  });

  await Issue.insertMany([
    {
      title: "Replace JSON storage with MongoDB",
      description: "Persist core entities using Mongoose schemas and controllers.",
      status: "todo",
      sprintId: sprint._id,
      assignedTo: users[0]._id,
    },
    {
      title: "Add real-time Kanban board updates",
      description: "Broadcast board changes across connected clients with Socket.io.",
      status: "in_progress",
      sprintId: sprint._id,
      assignedTo: users[1]._id,
    },
    {
      title: "Render dashboard through EJS",
      description: "Demonstrate SSR alongside the existing SPA routes.",
      status: "done",
      sprintId: sprint._id,
      assignedTo: users[0]._id,
    },
  ]);
}

module.exports = { seedDatabase };
