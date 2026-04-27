const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================= DATA ================= */
let schedules = [
  { id: 1, place: "Zone A", time: "Monday 7AM", collector: "Juan", status: "Scheduled" },
  { id: 2, place: "Zone B", time: "Wednesday 8AM", collector: "Maria", status: "Scheduled" }
];

let complaints = [];
let notifications = [];

/* ================= NOTIFY ================= */
function notify(msg) {
  notifications.unshift({
    id: Date.now(),
    message: msg
  });
}

/* ================= SCHEDULE API ================= */
app.get("/api/schedules", (req, res) => {
  res.json(schedules);
});

app.post("/api/schedules", (req, res) => {
  const newS = {
    id: Date.now(),
    place: req.body.place,
    time: req.body.time,
    collector: req.body.collector,
    status: "Scheduled"
  };

  schedules.push(newS);
  notify("New schedule added");

  res.json(newS);
});

app.put("/api/schedules/:id", (req, res) => {
  const s = schedules.find(x => x.id == req.params.id);
  if (!s) return res.sendStatus(404);

  Object.assign(s, req.body);
  notify("Schedule updated");

  res.json(s);
});

app.delete("/api/schedules/:id", (req, res) => {
  schedules = schedules.filter(x => x.id != req.params.id);
  notify("Schedule deleted");

  res.json({ ok: true });
});

/* ================= COMPLAINTS API ================= */
app.get("/api/complaints", (req, res) => {
  res.json(complaints);
});

app.post("/api/complaints", (req, res) => {
  const c = {
    id: Date.now(),
    text: req.body.text,
    status: "Pending",
    response: ""
  };

  complaints.push(c);
  notify("New complaint submitted");

  res.json(c);
});

app.put("/api/complaints/:id", (req, res) => {
  const c = complaints.find(x => x.id == req.params.id);
  if (!c) return res.sendStatus(404);

  Object.assign(c, req.body);
  notify("Complaint updated");

  res.json(c);
});

/* ================= NOTIFICATIONS ================= */
app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});