export function navbarHtml() {
  return `
    <header class="topbar">
      <div class="topbar__left">
        <button class="icon-btn mobile-only" id="mobileMenuBtn" aria-label="Open menu">
          <span class="icon">≡</span>
        </button>
        <div class="crumb" id="crumb">Dashboard</div>
      </div>
      <div class="topbar__right">
        <label class="topbar__search">
          <span class="topbar__searchIcon">⌕</span>
          <input id="globalSearch" class="input topbar__searchInput" placeholder="Search sprints, issues, team" />
        </label>
        <button class="btn btn--primary" id="topNewIssueBtn">New Issue</button>
        <div class="pill" id="activeSprintPill" hidden></div>
      </div>
    </header>
  `;
}

