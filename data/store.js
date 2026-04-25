const User = require("../models/User");
const Sprint = require("../models/Sprint");
const Issue = require("../models/Issue");
const Team = require("../models/Team");
const mongoose = require("mongoose");

function logWrite(operation, doc) {
  // Temporary persistence verification logs.
  // eslint-disable-next-line no-console
  console.log(`[mongo-write] ${operation}`, { _id: doc ? doc._id?.toString() : null });
}

function toObjectId(value) {
  if (!value) return null;
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (!mongoose.Types.ObjectId.isValid(String(value))) return null;
  return new mongoose.Types.ObjectId(String(value));
}

// ---- Users
async function getUserByEmail(email) {
  const user = await User.findOne({ email: String(email).toLowerCase() }).lean();
  if (!user) return null;
  if (!user.passwordHash && user.password) {
    await User.updateOne({ _id: user._id }, { $set: { passwordHash: user.password }, $unset: { password: 1 } });
    const migrated = await User.findById(user._id).lean();
    return migrated;
  }
  return user;
}

async function getUserById(userId) {
  return User.findById(userId).lean();
}

async function createUser({ email, passwordHash, name }) {
  const user = await User.create({
    email: String(email).toLowerCase(),
    name: name || String(email).split("@")[0],
    passwordHash,
  });
  logWrite("createUser", user);
  return user.toObject();
}

// ---- Sprints
async function listSprints() {
  const sprints = await Sprint.find().sort({ createdAt: -1 });
  return sprints.map((s) => s.toJSON());
}

async function getSprintById(sprintId) {
  const sprint = await Sprint.findById(sprintId);
  return sprint ? sprint.toJSON() : null;
}

async function createSprint({ name, goal, startDate, endDate }) {
  const sprint = await Sprint.create({ name, goal: goal || "", startDate: startDate || null, endDate: endDate || null });
  logWrite("createSprint", sprint);
  return sprint.toJSON();
}

async function updateSprint(sprintId, patch) {
  const sprint = await Sprint.findByIdAndUpdate(sprintId, patch, { new: true });
  if (sprint) logWrite("updateSprint", sprint);
  return sprint ? sprint.toJSON() : null;
}

async function getActiveSprint() {
  const sprint = await Sprint.findOne({ status: "active" }).sort({ startedAt: -1 });
  return sprint ? sprint.toJSON() : null;
}

// ---- Issues
async function listIssues(filters = {}) {
  const query = {};
  if (filters.sprintId !== undefined) {
    query.sprintId = filters.sprintId ? toObjectId(filters.sprintId) : null;
  }
  if (filters.notDone) {
    query.status = { $ne: "done" };
  }
  const issues = await Issue.find(query).sort({ createdAt: -1 });
  return issues.map((i) => i.toJSON());
}

async function getIssueById(issueId) {
  const issue = await Issue.findById(issueId);
  return issue ? issue.toJSON() : null;
}

async function createIssue({ title, description, sprintId, status }) {
  const issue = await Issue.create({
    title,
    description: description || "",
    sprintId: toObjectId(sprintId),
    status: status || "todo",
  });
  logWrite("createIssue", issue);
  return issue.toJSON();
}

async function updateIssue(issueId, patch) {
  const normalized = { ...patch };
  if (Object.prototype.hasOwnProperty.call(normalized, "sprintId")) {
    normalized.sprintId = toObjectId(normalized.sprintId);
  }
  if (Object.prototype.hasOwnProperty.call(normalized, "assigneeId")) {
    normalized.assignedTo = toObjectId(normalized.assigneeId);
    delete normalized.assigneeId;
  }
  const issue = await Issue.findByIdAndUpdate(issueId, normalized, { new: true });
  if (issue) logWrite("updateIssue", issue);
  return issue ? issue.toJSON() : null;
}

async function deleteIssue(issueId) {
  const deleted = await Issue.findByIdAndDelete(issueId);
  if (deleted) logWrite("deleteIssue", deleted);
}

// ---- Team
async function getTeam() {
  const members = await Team.find().sort({ createdAt: -1 });
  return { members: members.map((m) => m.toJSON()) };
}

async function addMember({ name, email, role }) {
  const member = await Team.create({ name, email: email || "", role: role || "Member" });
  logWrite("addMember", member);
  return member.toJSON();
}

async function updateMember(memberId, patch) {
  const member = await Team.findByIdAndUpdate(memberId, patch, { new: true });
  if (member) logWrite("updateMember", member);
  return member ? member.toJSON() : null;
}

module.exports = {
  // users
  getUserByEmail,
  getUserById,
  createUser,
  // sprints
  listSprints,
  getSprintById,
  createSprint,
  updateSprint,
  getActiveSprint,
  // issues
  listIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  // team
  getTeam,
  addMember,
  updateMember,
};

