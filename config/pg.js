const { Pool } = require("pg");

let pool;

function getPgPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.PG_CONNECTION_STRING,
      max: 4,
      idleTimeoutMillis: 5000,
    });
  }
  return pool;
}

async function getTeamAnalytics() {
  if (!process.env.PG_CONNECTION_STRING) {
    return { enabled: false, summary: [] };
  }

  const client = await getPgPool().connect();
  try {
    const { rows } = await client.query(
      `
      SELECT role, COUNT(*)::int AS count
      FROM team_member_snapshots
      GROUP BY role
      ORDER BY count DESC
      `
    );
    return { enabled: true, summary: rows };
  } finally {
    client.release();
  }
}

module.exports = { getPgPool, getTeamAnalytics };
