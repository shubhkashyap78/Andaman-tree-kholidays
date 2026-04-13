require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Package, Activity, Testimonial, Booking, Contact, Admin } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/images', express.static('images'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// ===== ADMIN AUTH ROUTES =====
app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();
    res.json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET);
    res.json({ token, admin: { username: admin.username, email: admin.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== PACKAGES ROUTES =====
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true });
    res.json(packages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/packages', authMiddleware, async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/packages', authMiddleware, async (req, res) => {
  try {
    const package = new Package(req.body);
    await package.save();
    res.json(package);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/packages/:id', authMiddleware, async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(package);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/packages/:id', authMiddleware, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== ACTIVITIES ROUTES =====
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await Activity.find({ isActive: true });
    res.json(activities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/activities', authMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/activities', authMiddleware, async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/activities/:id', authMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/activities/:id', authMiddleware, async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== TESTIMONIALS ROUTES =====
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).limit(6);
    res.json(testimonials);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(testimonial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== BOOKINGS ROUTES =====
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: 'Booking submitted successfully', booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/bookings/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== CONTACT ROUTES =====
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/contacts', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/contacts/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ===== DASHBOARD STATS =====
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const stats = {
      totalPackages: await Package.countDocuments(),
      totalActivities: await Activity.countDocuments(),
      totalBookings: await Booking.countDocuments(),
      pendingBookings: await Booking.countDocuments({ status: 'pending' }),
      totalContacts: await Contact.countDocuments(),
      newContacts: await Contact.countDocuments({ status: 'new' })
    };
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
