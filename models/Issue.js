const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
      index: true,
    },
    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
      default: null,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.sprintId = ret.sprintId ? ret.sprintId.toString() : null;
        ret.assigneeId = ret.assignedTo ? ret.assignedTo.toString() : null;
        delete ret._id;
        delete ret.__v;
        delete ret.assignedTo;
        return ret;
      },
    },
  }
);

module.exports = mongoose.models.Issue || mongoose.model("Issue", issueSchema);
