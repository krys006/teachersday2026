// ============================================================
// api/login.js  (runs on Vercel's server, NOT in the browser)
//
// The website sends a username + password here.
// If they match, we send back ONLY that one teacher's data.
// ============================================================
const crypto = require("crypto");
const teachers = require("./_data/teachers.json"); // made by scripts/hash-passwords.js

// ---- settings you can change ----
const MAX_FAILS = 8; // wrong tries allowed...
const WINDOW_MS = 10 * 60 * 1000; // ...per 10 minutes, per person
const WRONG_DELAY_MS = 500; // small pause after a wrong login

// Check a typed password against a saved "scrypt$salt$hash" text
function passwordMatches(password, stored) {
  const [, saltHex, hashHex] = stored.split("$");
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

// A fake saved password. Used when the username doesn't exist, so a wrong username
// takes the same time as a wrong password (no hints for guessers).
const DUMMY = (() => {
  const salt = crypto.randomBytes(16);
  return "scrypt$" + salt.toString("hex") + "$" + crypto.scryptSync("x", salt, 64).toString("hex");
})();

// Remember recent wrong tries (resets when the server restarts; good enough for this project)
const fails = new Map();
function tooManyFails(ip) {
  const now = Date.now();
  const list = (fails.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  fails.set(ip, list);
  return list.length >= MAX_FAILS;
}
function addFail(ip) {
  fails.get(ip).push(Date.now());
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
    if (tooManyFails(ip)) {
      return res.status(429).json({ error: "Too many tries. Please wait a few minutes." });
    }

    // Read what the website sent
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);
    const username = String((body && body.username) || "").trim().toLowerCase().slice(0, 100);
    const password = String((body && body.password) || "").trim().slice(0, 100);

    // Find the teacher and check the password
    const teacher = teachers.find((t) => t.username === username);
    const ok = passwordMatches(password, teacher ? teacher.passwordHash : DUMMY) && !!teacher;

    if (!ok) {
      addFail(ip);
      await sleep(WRONG_DELAY_MS);
      return res.status(401).json({ error: "Wrong username or password" });
    }

    // Success: send ONLY this teacher's own data (never the password hash or other teachers)
    return res.status(200).json({
      teacher: {
        name: teacher.name,
        title: teacher.title,
        messages: teacher.messages,
        memories: teacher.memories,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
