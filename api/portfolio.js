// Vercel Serverless Function: /api/portfolio
// Connects to Cloudflare D1 Database via Cloudflare REST API

const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-pin'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {
    CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_DATABASE_ID,
    CLOUDFLARE_API_TOKEN,
    ADMIN_PIN = 'aditya2026'
  } = process.env;

  const hasCloudflare = Boolean(
    CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_DATABASE_ID && CLOUDFLARE_API_TOKEN
  );

  // -------------------------------------------------------------
  // GET: Fetch portfolio data
  // -------------------------------------------------------------
  if (req.method === 'GET') {
    if (hasCloudflare) {
      try {
        const d1Url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;
        const cfResponse = await fetch(d1Url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sql: "SELECT data FROM portfolio_store WHERE id = 'master' LIMIT 1;"
          })
        });

        const cfResult = await cfResponse.json();
        if (cfResult.success && cfResult.result && cfResult.result[0]?.results?.length > 0) {
          const rawData = cfResult.result[0].results[0].data;
          const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
          return res.status(200).json(parsed);
        }
      } catch (err) {
        console.warn('Error reading from Cloudflare D1, falling back to local data.json:', err);
      }
    }

    // Fallback: Return data.json from project root
    try {
      const dataFilePath = path.join(process.cwd(), 'data.json');
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');
      return res.status(200).json(JSON.parse(fileData));
    } catch (e) {
      return res.status(500).json({ error: 'Failed to load portfolio data.' });
    }
  }

  // -------------------------------------------------------------
  // POST / PUT: Update portfolio data (Admin authenticated)
  // -------------------------------------------------------------
  if (req.method === 'POST' || req.method === 'PUT') {
    const enteredPin = req.headers['x-admin-pin'] || req.body?.pin;
    if (enteredPin !== ADMIN_PIN) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Admin PIN' });
    }

    const payload = req.body?.data || req.body;
    if (!payload || !payload.profile) {
      return res.status(400).json({ error: 'Invalid payload: Profile data required.' });
    }

    if (hasCloudflare) {
      try {
        const d1Url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;
        
        // 1. Ensure table exists
        await fetch(d1Url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sql: "CREATE TABLE IF NOT EXISTS portfolio_store (id TEXT PRIMARY KEY, data TEXT, updated_at TEXT);"
          })
        });

        // 2. Upsert portfolio data
        const saveResponse = await fetch(d1Url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sql: "INSERT INTO portfolio_store (id, data, updated_at) VALUES ('master', ?, datetime('now')) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;",
            params: [JSON.stringify(payload)]
          })
        });

        const saveResult = await saveResponse.json();
        if (saveResult.success) {
          return res.status(200).json({
            success: true,
            storage: 'cloudflare_d1',
            message: 'Portfolio successfully saved to Cloudflare D1 Database!'
          });
        } else {
          throw new Error(JSON.stringify(saveResult.errors || 'Failed to save to D1'));
        }
      } catch (cfErr) {
        console.error('Cloudflare D1 save failed:', cfErr);
        return res.status(500).json({ error: 'Failed to write to Cloudflare D1', details: cfErr.message });
      }
    }

    // If Cloudflare is not yet configured, return acknowledgment
    return res.status(200).json({
      success: true,
      storage: 'fallback_browser',
      message: 'Cloudflare credentials not yet configured in Vercel environment variables. Data saved locally in browser.'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
