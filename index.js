const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ================= DATA STORAGE ================= */

let schedules = [
  {
    id: 1,
    place: 'Barangay 12 - Zone A',
    time: 'Monday 7:00 AM',
    collector: 'Juan dela Cruz',
    status: 'Scheduled',
  },
];

let complaints = [];
let notifications = [];

/* ================= HELPER ================= */

function pushNotification(message) {
  notifications.unshift({
    id: Date.now(),
    message,
    date: new Date(),
  });
}

/* ======================================================
   ================= ADMIN FEATURES ======================
   ====================================================== */

/* ➤ CREATE SCHEDULE */
app.post('/api/admin/schedules', (req, res) => {
  const { place, time, collector } = req.body;

  const newSchedule = {
    id: Date.now(),
    place,
    time,
    collector: collector || 'Unassigned',
    status: 'Scheduled',
  };

  schedules.push(newSchedule);
  pushNotification('Admin created a new schedule');

  res.json(newSchedule);
});

/* ➤ UPDATE SCHEDULE */
app.put('/api/admin/schedules/:id', (req, res) => {
  const sched = schedules.find((s) => s.id == req.params.id);
  if (!sched) return res.status(404).json({ error: 'Schedule not found' });

  Object.assign(sched, req.body);

  pushNotification(`Schedule updated: ${sched.place}`);
  res.json(sched);
});

/* ➤ DELETE SCHEDULE */
app.delete('/api/admin/schedules/:id', (req, res) => {
  schedules = schedules.filter((s) => s.id != req.params.id);

  pushNotification('Schedule removed by admin');
  res.json({ message: 'Schedule deleted' });
});

/* ➤ VIEW ALL COMPLAINTS */
app.get('/api/admin/complaints', (req, res) => {
  res.json(complaints);
});

/* ➤ UPDATE COMPLAINT STATUS + RESPONSE */
app.put('/api/admin/complaints/:id', (req, res) => {
  const complaint = complaints.find((c) => c.id == req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const { status, response } = req.body;

  if (status) complaint.status = status;
  if (response) complaint.response = response;

  pushNotification('Complaint updated by admin');

  res.json(complaint);
});

/* ➤ SEND GLOBAL NOTIFICATION */
app.post('/api/admin/notify', (req, res) => {
  const { message } = req.body;

  pushNotification(message);

  res.json({ message: 'Notification sent' });
});

/* ======================================================
   ================= USER FEATURES ======================
   ====================================================== */

/* ➤ VIEW SCHEDULES */
app.get('/api/user/schedules', (req, res) => {
  res.json(schedules);
});

/* ➤ SUBMIT COMPLAINT */
app.post('/api/user/complaints', (req, res) => {
  const { text, image } = req.body;

  const newComplaint = {
    id: Date.now(),
    text,
    image: image || null,
    status: 'Pending',
    response: '',
  };

  complaints.push(newComplaint);
  pushNotification('New complaint submitted');

  res.json(newComplaint);
});

/* ➤ VIEW USER COMPLAINTS */
app.get('/api/user/complaints', (req, res) => {
  res.json(complaints);
});

/* ➤ VIEW NOTIFICATIONS */
app.get('/api/user/notifications', (req, res) => {
  res.json(notifications);
});

/* ======================================================
   ================= COLLECTOR FEATURES ==================
   ====================================================== */

/* ➤ VIEW ASSIGNED SCHEDULES */
app.get('/api/collector/schedules', (req, res) => {
  res.json(schedules);
});

/* ➤ UPDATE COLLECTION STATUS */
app.put('/api/collector/schedules/:id', (req, res) => {
  const sched = schedules.find((s) => s.id == req.params.id);
  if (!sched) return res.status(404).json({ error: 'Schedule not found' });

  sched.status = req.body.status || 'Completed';

  pushNotification(`Collector updated: ${sched.place}`);

  res.json(sched);
});

/* ======================================================
   ================= NOTIFICATIONS ======================
   ====================================================== */

/* ➤ GET ALL NOTIFICATIONS */
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

/* ======================================================
   ================= START SERVER =======================
   ====================================================== */

app.listen(PORT, () => {
  console.log(`🚀 EcoTrack API running at http://localhost:${PORT}`);
});
