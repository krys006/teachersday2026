// ============================================================
// hash-passwords.js
// Run this on YOUR computer whenever you change teachers.
//
// It reads:   private/teachers.source.js   (plain passwords, stays on your PC)
// It writes:  api/_data/teachers.json      (scrambled passwords, safe to upload)
//
// Run it from the project folder with:   node scripts/hash-passwords.js
// ============================================================
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.join(__dirname, ".."); // the project folder
const sourceFile = path.join(root, "private", "teachers.source.js");
const outFile = path.join(root, "api", "_data", "teachers.json");

// 1. Read your teachers list from the private file
if (!fs.existsSync(sourceFile)) {
  console.error("Can't find private/teachers.source.js. Did you finish step 1?");
  process.exit(1);
}
let teachers;
try {
  teachers = new Function(fs.readFileSync(sourceFile, "utf8") + "\nreturn teachers;")();
} catch (err) {
  console.error("Your teachers.source.js has a typo (missing comma or quote?):\n" + err.message);
  process.exit(1);
}

// 2. Scramble ("hash") a password. Same password gives a different result every time
//    because of the random "salt", and the result can't be turned back into the password.
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return "scrypt$" + salt.toString("hex") + "$" + hash.toString("hex");
}

// 3. Build the safe version of every teacher
const seen = new Set();
const safe = teachers.map((t, i) => {
  const label = "Teacher #" + (i + 1) + " (" + (t.name || "no name") + ")";
  const username = String(t.username || "").trim().toLowerCase();
  const password = String(t.password || "").trim();
  if (!username) throw new Error(label + " has no username.");
  if (!password) throw new Error(label + " has no password.");
  if (seen.has(username)) throw new Error("Two teachers share the username '" + username + "'.");
  seen.add(username);
  if (password.length < 8) console.warn("  Note: " + label + " has a short password (under 8 characters).");
  return {
    username,
    passwordHash: hashPassword(password), // the plain password is NOT saved
    name: t.name,
    title: t.title,
    messages: t.messages || [],
    memories: t.memories || [],
  };
});

// 4. Save the result
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(safe, null, 2));

console.log("\nDone! Saved " + safe.length + " teachers to api/_data/teachers.json");
safe.forEach((t) =>
  console.log("  - " + t.username + ": " + t.messages.length + " messages, " + t.memories.length + " memories"),
);
