export function issueCardHtml(issue, { assigneeName, draggable = true } = {}) {
  const assignee = assigneeName || "Unassigned";
  const dragAttr = draggable ? `draggable="true"` : "";
  const title = escapeHtml(issue.title);
  const initials = escapeHtml(
    assignee
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
  const priority = priorityLabel(issue.status);
  const priorityClass = priority.className;
  return `
    <div class="issue" ${dragAttr} data-issue="${issue.id}" data-status="${issue.status}">
      <div class="issue__title">${title}</div>
      <div class="muted issue__desc">${escapeHtml(issue.description || "No description provided.")}</div>
      <div class="issue__meta">
        <span class="badge badge--outline">${escapeHtml(statusLabel(issue.status))}</span>
        <span class="badge ${priorityClass}">${escapeHtml(priority.label)}</span>
        <span class="badge badge--outline">${escapeHtml(title.split(/\s+/).slice(0, 2).join(" "))}</span>
        <span class="spacer"></span>
        <span class="issue__assignee avatar avatar--xs">${initials}</span>
      </div>
    </div>
  `;
}

export function statusLabel(status) {
  if (status === "in_progress") return "In Progress";
  return String(status).charAt(0).toUpperCase() + String(status).slice(1);
}

function priorityLabel(status) {
  if (status === "todo") return { label: "Medium", className: "badge--warning" };
  if (status === "in_progress") return { label: "High", className: "badge--danger" };
  return { label: "Low", className: "badge--active" };
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

