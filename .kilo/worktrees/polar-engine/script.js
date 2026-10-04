const $ = (s) => document.querySelector(s),
  sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
let user = null,
  idx = 0,
  muted = true,
  actx,
  cur = null,
  token = 0;
// ---------- sound (optional, only after tap) ----------
function beep(f = 660, d = 0.12) {
  if (muted) return;
  try {
    actx = actx || new AudioContext();
    const o = actx.createOscillator(),
      g = actx.createGain();
    o.frequency.value = f;
    g.gain.value = 0.04;
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + d);
    o.connect(g);
    g.connect(actx.destination);
    o.start();
    o.stop(actx.currentTime + d);
  } catch (e) {}
}
$("#snd").onclick = (e) => {
  muted = !muted;
  e.target.textContent = muted ? "🔇" : "🔊";
  e.target.setAttribute("aria-pressed", !muted);
  e.target.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");
  beep(880);
};
// ---------- particles ----------
const cv = $("#bg"),
  c = cv.getContext("2d");
let W,
  H,
  P = [];
const G = ["✿", "❀", "✦", "✧", "•", "💠"],
  COL = ["#2f8cff", "#18b7d9", "#7fe7f2", "#2fbf9a"];
function size() {
  const d = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  cv.width = W * d;
  cv.height = H * d;
  c.setTransform(d, 0, 0, d, 0, 0);
}
addEventListener("resize", size);
size();
const rnd = (a, b) => a + Math.random() * (b - a);
function mk(burst, x, y) {
  const g = G[Math.floor(rnd(0, G.length))];
  return {
    x: x ?? rnd(0, W),
    y: y ?? rnd(0, H),
    vx: burst ? rnd(-4, 4) : rnd(-0.2, 0.2),
    vy: burst ? rnd(-9, -3) : -rnd(0.15, 0.5),
    s: g.length > 1 || g === "💠" ? rnd(14, 22) : rnd(8, 16),
    g,
    c: COL[Math.floor(rnd(0, 4))],
    r: rnd(0, 6),
    vr: rnd(-0.03, 0.03),
    life: burst ? 1 : 0,
  };
}
for (let i = 0; i < (RM ? 10 : 26); i++) P.push(mk());
function burst(n = 30, x = W / 2, y = H * 0.6) {
  if (RM) n = 8;
  for (let i = 0; i < n; i++) P.push(mk(true, x, y));
}
(function loop() {
  c.clearRect(0, 0, W, H);
  P = P.filter((p) => (!p.life && p.life !== 0) || p.life > 0 || p.life === 0);
  for (const p of P) {
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    if (p.life > 0) {
      p.vy += 0.14;
      p.life -= 0.012;
    } else if (!p.life) {
      if (p.y < -30) {
        p.y = H + 20;
        p.x = rnd(0, W);
      }
      if (p.x < -30) p.x = W + 20;
      if (p.x > W + 30) p.x = -20;
    }
    const a = p.life > 0 ? p.life : p.life === 0 ? 0.65 : 0;
    c.globalAlpha = Math.max(a, 0);
    c.save();
    c.translate(p.x, p.y);
    c.rotate(p.r);
    c.font = p.s + "px serif";
    c.fillStyle = p.c;
    c.fillText(p.g, 0, 0);
    c.restore();
  }
  P = P.filter((p) => p.life === 0 || p.life > 0);
  requestAnimationFrame(loop);
})();
// ---------- screen transitions ----------
const hooks = {};
async function go(id) {
  if (cur) {
    cur.classList.add("out");
    await sleep(450);
    cur.classList.remove("active", "out");
  }
  const n = $("#" + id);
  n.classList.add("active");
  cur = n;
  n.scrollTop = 0;
  $("#bar").hidden = !user || id === "s-login";
  hooks[id] && hooks[id]();
}
cur = $("#s-open");
document.addEventListener("click", (e) => {
  const b = e.target.closest(".btn");
  if (!b) return;
  const r = document.createElement("span"),
    k = b.getBoundingClientRect();
  r.className = "rip";
  r.style.left = e.clientX - k.left + "px";
  r.style.top = e.clientY - k.top + "px";
  b.appendChild(r);
  setTimeout(() => r.remove(), 650);
  beep(520, 0.08);
});
// ---------- 1. opening ----------
{
  const t = $("#ttl");
  let k = 0;
  "HAPPY|TEACHERS DAY|PO!".split("").forEach((ch) => {
    if (ch === "|") return t.appendChild(document.createElement("br"));
    const s = document.createElement("span");
    s.textContent = ch === " " ? "\u00A0" : ch;
    s.style.animationDelay = 0.3 + k++ * 0.06 + "s";
    t.appendChild(s);
  });
}
$("#begin").onclick = async () => {
  burst(50, W / 2, H * 0.7);
  P.forEach((p) => {
    if (!p.life) {
      p.vx = rnd(-3, 3);
      p.vy = rnd(-3, 3);
    }
  });
  await sleep(300);
  go("s-init");
};
// ---------- 2. init ----------
hooks["s-init"] = async () => {
  const L = [
      "Connecting to student network",
      "Loading memories",
      "Preparing messages",
      "Preparing teacher profile",
    ],
    ul = $("#lines");
  ul.innerHTML = "";
  $("#ready").hidden = true;
  for (let i = 0; i < L.length; i++) {
    const li = document.createElement("li");
    li.textContent = "✓ " + L[i];
    ul.appendChild(li);
    beep(600 + i * 90, 0.08);
    const to = Math.round(((i + 1) / L.length) * 100);
    $("#pbar").style.width = to + "%";
    $("#pct").textContent = to + "%";
    await sleep(560);
  }
  $("#ready").hidden = false;
  beep(990, 0.2);
  await sleep(700);
  go("s-login");
};
// ---------- 3. login ----------
$("#form").onsubmit = async (e) => {
  e.preventDefault(); // stop the page from reloading
  const form = $("#form"),
    msg = $("#lmsg"),
    btn = form.querySelector("button");
  const say = (text, ok) => {
    msg.textContent = text;
    msg.className = "mono msg" + (ok ? " ok" : "");
  };

  try {
    
    const username = $("#u").value.trim().toLowerCase(),
      password = $("#p").value.trim();
    const teacher = teachers.find(
      (t) => t.username.toLowerCase() === username && t.password === password,
    );

    // Wrong login: friendly message + little shake
    if (!teacher) {
      say("Hmm, that doesn't match. Check the note we gave you \u{1F499}");
      form.classList.remove("shake");
      void form.offsetWidth;
      form.classList.add("shake");
      return;
    }

    // Correct login: short "authentication" sequence, then go to the welcome screen
    btn.disabled = true;
    for (const step of ["AUTHENTICATING...", "IDENTITY VERIFIED \u2713", "ACCESS GRANTED"]) {
      say(step, true);
      beep(700, 0.1);
      await sleep(750);
    }
    user = teacher;
    idx = 0;
    say("");
    form.reset();
    burst(24);
    go("s-welcome");
  } catch (err) {
    say("Something went wrong: " + err.message);
    console.error(err);
  } finally {
    btn.disabled = false;
  }
};

// ---------- 4. welcome ----------
hooks["s-welcome"] = () => {
  $("#wname").textContent = user.name;
  const n = user.messages.length,
    el = $("#wcount"),
    t0 = performance.now();
  (function tick(t) {
    const k = Math.min((t - t0) / 1500, 1);
    el.textContent = Math.round(k * n);
    if (k < 1) requestAnimationFrame(tick);
    else el.classList.add("pop");
  })(t0);
};
$("#openMsgs").onclick = () => {
  idx = 0;
  go("s-msg");
};
// ---------- 5/6. messages ----------
const ANIMS = ["envelope", "polaroid", "sticky", "terminal", "flower", "circuit", "sparkle"];
async function typeInto(el, text, my) {
  el.textContent = "";
  for (const ch of text) {
    if (my !== token) return;
    el.textContent += ch;
    await sleep(RM ? 0 : 24);
  }
}
function card(m, a, my) {
  const s = $("#stage");
  s.innerHTML = "";
  const d = document.createElement("article");
  d.className = "card a-" + a;
  d.innerHTML = '<i class="deco tl"></i><i class="deco br"></i><p></p>';
  s.appendChild(d);
  burst(10, W / 2, H * 0.45);
  beep(880, 0.15);
  const p = d.querySelector("p");
  if (a === "terminal") typeInto(p, '> "' + m.text + '"', my);
  else p.textContent = "“" + m.text + "”";
}
async function show(i) {
  token++;
  const my = token,
    m = user.messages[i],
    n = user.messages.length;
  let a = ANIMS.includes(m.animation) ? m.animation : "sparkle";
  $("#mprog").textContent = `MESSAGE ${i + 1} OF ${n}`;
  $("#mbar").style.width = ((i + 1) / n) * 100 + "%";
  $("#prev").disabled = i === 0;
  $("#next").textContent = i === n - 1 ? "FINISH ✓" : "NEXT →";
  const s = $("#stage");
  if (a === "envelope") {
    s.innerHTML =
      '<button class="env" aria-label="Open the envelope"><i class="flap"></i><span class="seal">🩷</span></button><p class="mono hint">tap to open</p>';
    s.querySelector(".env").onclick = async (e) => {
      e.currentTarget.classList.add("open");
      beep(440, 0.2);
      await sleep(900);
      if (my === token) card(m, a, my);
    };
  } else card(m, a, my);
}
hooks["s-msg"] = () => show(idx);
$("#next").onclick = () => {
  if (idx < user.messages.length - 1) {
    idx++;
    show(idx);
  } else go("s-mem");
};
$("#prev").onclick = () => {
  if (idx > 0) {
    idx--;
    show(idx);
  }
};
addEventListener("keydown", (e) => {
  if (cur && cur.id === "s-msg") {
    if (e.key === "ArrowRight") $("#next").click();
    if (e.key === "ArrowLeft") $("#prev").click();
  }
});
// ---------- 7. memories ----------
hooks["s-mem"] = () => {
  const g = $("#gallery");
  g.innerHTML = "";
  const M = user.memories || [];
  if (!M.length) {
    g.innerHTML =
      '<div class="polaroid ph" style="--i:0"><div class="img">💠</div><p>Our photos are still developing…<br>check back soon.</p></div>';
    return;
  }
  M.forEach((m, i) => {
    const d = document.createElement("figure");
    d.className = "polaroid";
    d.style.setProperty("--i", i);
    d.style.setProperty("--rot", (i % 2 ? 2.5 : -2.5) + "deg");
    const im = new Image();
    im.src = m.image;
    im.alt = m.caption || "A memory with your students";
    im.loading = "lazy";
    im.onerror = () => {
      im.replaceWith(
        Object.assign(document.createElement("div"), {
          className: "img",
          textContent: "💠",
        }),
      );
    };
    const w = document.createElement("div");
    w.className = "img";
    w.appendChild(im);
    const cp = document.createElement("figcaption");
    cp.textContent = m.caption || "";
    d.append(w, cp);
    g.appendChild(d);
  });
};
$("#memNext").onclick = () => go("s-diag");
// ---------- 8. diagnostics ----------
hooks["s-diag"] = async () => {
  const el = $("#diag"),
    nb = $("#diagNext");
  nb.hidden = true;
  el.innerHTML =
    '<h2 class="mono sm">TEACHER_DIAGNOSTICS.exe</h2>' +
    ["Patience", "Knowledge", "Kindness", "Student Support", "Inspiration"]
      .map(
        (n, i) =>
          `<div class="stat" style="--i:${i}"><span>${n}</span><b>100%</b><i><u></u></i></div>`,
      )
      .join("") +
    '<p class="mono" id="calc"></p><p class="err mono" id="err" hidden>ERROR:<br>VALUE TOO LARGE TO COMPUTE.</p><p class="quote" id="q" hidden>Some things simply cannot be measured.</p><p class="mono dim" id="inf" hidden>&gt; RUNNING teacher_impact.exe<br>&gt; Result: <b>∞</b></p>';
  await sleep(2600);
  const k = $("#calc");
  for (const v of [0, 23, 47, 81, 99, 100]) {
    if (cur.id !== "s-diag") return;
    k.textContent = "Calculating teacher impact... " + v + "%";
    beep(400 + v * 4, 0.06);
    await sleep(420);
  }
  $("#err").hidden = false;
  beep(200, 0.3);
  await sleep(1100);
  $("#q").hidden = false;
  await sleep(900);
  $("#inf").hidden = false;
  await sleep(700);
  nb.hidden = false;
};
$("#diagNext").onclick = () => go("s-status");
// ---------- 9. status ----------
hooks["s-status"] = async () => {
  const el = $("#stat"),
    nb = $("#statNext");
  nb.hidden = true;
  el.innerHTML = '<h2 class="mono sm">SYSTEM STATUS</h2>';
  for (const [n, v] of [
    ["Processor", "PASS"],
    ["Memory", "PASS"],
    ["Teaching", "PASS"],
    ["Patience", "PASS"],
    ["Inspiration", "PASS"],
    ["Student Impact", "∞"],
  ]) {
    if (cur.id !== "s-status") return;
    const r = document.createElement("div");
    r.className = "row";
    r.innerHTML = `<span>${n}</span><em></em><b>${v}</b>`;
    el.appendChild(r);
    beep(700, 0.05);
    await sleep(520);
  }
  el.insertAdjacentHTML(
    "beforeend",
    '<p class="cond">SYSTEM CONDITION:<br><strong>FULLY APPRECIATED</strong></p>',
  );
  burst(20);
  await sleep(900);
  nb.hidden = false;
};
$("#statNext").onclick = () => go("s-final");
// ---------- 10. final ----------
let celeb;
hooks["s-final"] = async () => {
  const t = $("#thanks"),
    a = $("#allread");
  t.hidden = true;
  a.hidden = false;
  $("#fname").textContent = user.name;
  beep(660, 0.2);
  await sleep(1700);
  a.hidden = true;
  t.hidden = false;
  const party = () => {
    burst(36, rnd(W * 0.2, W * 0.8), H * 0.75);
  };
  party();
  clearInterval(celeb);
  celeb = setInterval(() => {
    if (cur.id === "s-final") party();
    else clearInterval(celeb);
  }, 3200);
};
// ---------- nav ----------
$("#home").onclick = () => user && go("s-welcome");
$("#logout").onclick = () => {
  user = null;
  token++;
  clearInterval(celeb);
  go("s-login");
};
