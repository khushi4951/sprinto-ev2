const Issue = require("../models/Issue");
const Sprint = require("../models/Sprint");

async function renderLogin(req, res) {
  if (req.session && req.session.userId) {
    return res.redirect("/dashboard");
  }

  return res.render("login", {
    pageTitle: "Sprinto Login",
    error: null,
  });
}

async function renderDashboard(req, res, next) {
  try {
    const [sprints, activeSprint, issueStats] = await Promise.all([
      Sprint.find().sort({ createdAt: -1 }),
      Sprint.findOne({ status: "active" }).sort({ startedAt: -1 }),
      Issue.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return res.render("dashboard", {
      pageTitle: "Sprinto Dashboard",
      user: req.user,
      activeSprint: activeSprint ? activeSprint.toJSON() : null,
      sprints: sprints.map((sprint) => sprint.toJSON()),
      issueStats,
    });
  } catch (err) {
    return next(err);
  }
}

async function renderSprint(req, res, next) {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).render("login", {
        pageTitle: "Sprint Not Found",
        error: "The requested sprint does not exist.",
      });
    }

    const issues = await Issue.find({ sprintId: sprint._id }).sort({ createdAt: -1 });

    return res.render("sprint", {
      pageTitle: sprint.name,
      user: req.user,
      sprint: sprint.toJSON(),
      issues: issues.map((issue) => issue.toJSON()),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { renderLogin, renderDashboard, renderSprint };
