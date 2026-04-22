let role = "user";

let schedules = [];
let complaints = [];
let notifications = [];

/* ================= ROLE ================= */
function setRole(r) {
  role = r;
  loadSchedules();
  loadComplaints();
  loadNotifications();

  document.getElementById("adminScheduleForm").style.display =
    role === "admin" ? "block" : "none";
}

/* ================= NAV ================= */
function showSection(section) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(section).classList.add("active");
}

/* ================= SCHEDULE ================= */
async function loadSchedules() {
  const res = await fetch("/api/schedules");
  schedules = await res.json();

  const list = document.getElementById("scheduleList");
  list.innerHTML = "";

  schedules.forEach(s => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${s.place}</h3>
      <p>${s.time}</p>
      <p>Collector: ${s.collector}</p>
      <strong>Status: ${s.status}</strong>
    `;

    if (role === "collector") {
      div.innerHTML += `
        <button onclick="markDone(${s.id})">Mark Completed</button>
      `;
    }

    if (role === "admin") {
      div.innerHTML += `
        <button onclick="deleteSchedule(${s.id})">Delete</button>
      `;
    }

    list.appendChild(div);
  });
}

async function addSchedule() {
  await fetch("/api/schedules", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      place: place.value,
      time: time.value,
      collector: collector.value
    })
  });

  loadSchedules();
}

async function deleteSchedule(id) {
  await fetch(`/api/schedules/${id}`, { method: "DELETE" });
  loadSchedules();
}

async function markDone(id) {
  await fetch(`/api/schedules/${id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ status: "Completed" })
  });

  loadSchedules();
}

/* ================= COMPLAINTS ================= */
async function submitComplaint() {
  await fetch("/api/complaints", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ text: complaintText.value })
  });

  complaintText.value = "";
  loadComplaints();
}

async function loadComplaints() {
  const res = await fetch("/api/complaints");
  complaints = await res.json();

  const list = document.getElementById("complaintList");
  list.innerHTML = "";

  complaints.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p>${c.text}</p>
      <strong>Status: ${c.status}</strong>
      <p>Response: ${c.response || "None"}</p>
    `;

    if (role === "admin") {
      div.innerHTML += `
        <button onclick="updateStatus(${c.id}, 'In Progress')">In Progress</button>
        <button onclick="updateStatus(${c.id}, 'Resolved')">Resolve</button>
        <input id="reply-${c.id}" placeholder="Reply">
        <button onclick="reply(${c.id})">Send</button>
      `;
    }

    list.appendChild(div);
  });
}

async function updateStatus(id, status) {
  await fetch(`/api/complaints/${id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ status })
  });

  loadComplaints();
}

async function reply(id) {
  const msg = document.getElementById(`reply-${id}`).value;

  await fetch(`/api/complaints/${id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ response: msg })
  });

  loadComplaints();
}

/* ================= NOTIFICATIONS ================= */
async function loadNotifications() {
  const res = await fetch("/api/notifications");
  notifications = await res.json();

  const list = document.getElementById("notificationList");
  list.innerHTML = "";

  notifications.forEach(n => {
    const div = document.createElement("div");
    div.className = "notification";
    div.textContent = n.message;
    list.appendChild(div);
  });
}

/* INIT */
loadSchedules();
loadComplaints();
loadNotifications();