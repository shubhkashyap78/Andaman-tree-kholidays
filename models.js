const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Honeymoon', 'Family', 'Best Seller', 'Adventure', 'LTC', 'Group', 'Student'], default: 'Family' },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  route: { type: String },
  image: { type: String, required: true },
  features: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  icon: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  initials: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, default: 5 },
  reviewDate: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  package: { type: String },
  activity: { type: String },
  date: { type: Date },
  adults: { type: Number },
  children: { type: Number },
  message: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  package: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
}, { timestamps: true });

module.exports = {
  Package: mongoose.model('Package', packageSchema),
  Activity: mongoose.model('Activity', activitySchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Booking: mongoose.model('Booking', bookingSchema),
  Contact: mongoose.model('Contact', contactSchema),
  Admin: mongoose.model('Admin', adminSchema)
};
