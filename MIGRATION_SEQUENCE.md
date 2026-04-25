## Upgrade Sequence

1. Middleware foundation
   - Added application middleware in `server.js` (`logger`, `express.json`, cookie parser, session).
   - Added router-level validation middleware in `routes/*`.
   - Centralized error handling in `middleware/errorHandler.js`.

2. Database integration
   - Connected MongoDB via `config/db.js`.
   - Replaced JSON-file datastore with Mongoose-backed operations in `data/store.js`.
   - Standardized domain models in `models/User.js`, `models/Sprint.js`, `models/Issue.js`, and `models/Team.js`.

3. Authentication upgrade
   - Password hashing via bcrypt in `controllers/authController.js`.
   - JWT issue/validation and bearer-token support via `middleware/requireAuth.js`.
   - Session management added through `express-session` and used with JWT fallback.

4. SSR integration
   - Configured EJS in `server.js`.
   - Added view routes in `routes/viewRoutes.js`.
   - Added rendered login/dashboard/sprint pages in `views/`.

5. Real-time behavior
   - Socket.io server integrated in `server.js`.
   - Live issue and sprint events emitted from controllers.
   - SPA client now listens to updates and refreshes board/sprint UI.

6. Optional SQL feature
   - PostgreSQL integration through `config/pg.js`.
   - Team analytics endpoint exposed at `GET /api/team/analytics`.
