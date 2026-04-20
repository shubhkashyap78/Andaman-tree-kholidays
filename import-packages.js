const mongoose = require('mongoose');
const { Package } = require('./models');
require('dotenv').config();

// Package data extracted from HTML files
const packages = [
  // Honeymoon Packages
  {
    name: '3 Nights 4 Days Honeymoon Package',
    category: 'Honeymoon',
    duration: '3 Nights 4 Days',
    price: 15000,
    route: '1N Port Blair · 1N Havelock · 1N Port Blair',
    image: 'images/Honeymoon1.jpeg',
    description: 'Perfect romantic getaway for newlyweds. Experience the pristine beaches, crystal-clear waters, and create unforgettable memories in the Andaman Islands.',
    features: ['Cellular Jail Visit', 'Radhanagar Beach', 'Elephant Beach Snorkeling', 'Candlelight Dinner', 'Complimentary Photoshoot'],
    isActive: true
  },
  {
    name: '4 Nights 5 Days Honeymoon Package',
    category: 'Honeymoon',
    duration: '4 Nights 5 Days',
    price: 22000,
    route: '2N Port Blair · 1N Havelock · 1N Neil Island',
    image: 'images/honeymoon2.jpeg',
    description: 'Extended romantic escape with visits to Port Blair, Havelock, and Neil Island. Perfect blend of adventure and relaxation.',
    features: ['Ross Island Tour', 'Radhanagar Beach', 'Neil Island Sightseeing', 'Private Beach Dinner', 'Couple Spa Session'],
    isActive: true
  },
  {
    name: '5 Nights 6 Days Honeymoon Package',
    category: 'Honeymoon',
    duration: '5 Nights 6 Days',
    price: 32000,
    route: '2N Port Blair · 2N Havelock · 1N Neil Island',
    image: 'images/honeymoon3.jpeg',
    description: 'Luxury honeymoon package with extended stays at premium resorts. Includes all major attractions and romantic experiences.',
    features: ['Luxury Resort Stay', 'Scuba Diving', 'Sunset Cruise', 'Beach Villa', 'Romantic Decorations'],
    isActive: true
  },
  {
    name: '6 Nights 7 Days Honeymoon Package',
    category: 'Honeymoon',
    duration: '6 Nights 7 Days',
    price: 42000,
    route: '2N Port Blair · 2N Havelock · 2N Neil Island',
    image: 'images/honeymoon4.jpeg',
    description: 'Ultimate honeymoon experience with leisure time at each island. Perfect for couples who want a relaxed romantic vacation.',
    features: ['Premium Hotels', 'All Water Sports', 'Private Island Tour', 'Couple Photography', 'Romantic Surprises'],
    isActive: true
  },
  {
    name: '7 Nights 8 Days Honeymoon Package',
    category: 'Honeymoon',
    duration: '7 Nights 8 Days',
    price: 52000,
    route: '3N Port Blair · 2N Havelock · 2N Neil Island',
    image: 'images/honeymoon5.jpeg',
    description: 'Extended luxury honeymoon with maximum relaxation time. Includes premium accommodations and exclusive experiences.',
    features: ['5-Star Resorts', 'Private Yacht', 'Helicopter Ride', 'Luxury Spa', 'Gourmet Dining'],
    isActive: true
  },

  // Family Packages
  {
    name: '3 Nights 4 Days Family Package',
    category: 'Family',
    duration: '3 Nights 4 Days',
    price: 15000,
    route: '1N Port Blair · 1N Havelock · 1N Port Blair',
    image: 'images/family1.jpeg',
    description: 'Perfect family vacation covering major attractions. Kid-friendly activities and comfortable accommodations.',
    features: ['Family-Friendly Hotels', 'Cellular Jail Tour', 'Beach Activities', 'Snorkeling', 'Light & Sound Show'],
    isActive: true
  },
  {
    name: '4 Nights 5 Days Family Package',
    category: 'Family',
    duration: '4 Nights 5 Days',
    price: 22000,
    route: '2N Port Blair · 1N Havelock · 1N Neil Island',
    image: 'images/family2.jpeg',
    description: 'Comprehensive family tour with visits to three islands. Balanced mix of sightseeing and beach time.',
    features: ['Spacious Rooms', 'Ross Island', 'Water Sports', 'Neil Island Tour', 'Family Photoshoot'],
    isActive: true
  },
  {
    name: '5 Nights 6 Days Family Package',
    category: 'Family',
    duration: '5 Nights 6 Days',
    price: 32000,
    route: '2N Port Blair · 2N Havelock · 1N Neil Island',
    image: 'images/family3.jpeg',
    description: 'Extended family vacation with leisure time at each destination. Perfect for families with children.',
    features: ['Interconnected Rooms', 'All Sightseeing', 'Beach Games', 'Kids Activities', 'Family Meals'],
    isActive: true
  },
  {
    name: '6 Nights 7 Days Family Package',
    category: 'Family',
    duration: '6 Nights 7 Days',
    price: 42000,
    route: '2N Port Blair · 2N Havelock · 2N Neil Island',
    image: 'images/family4.jpeg',
    description: 'Relaxed family holiday with ample time at beaches. Includes all major attractions and activities.',
    features: ['Premium Hotels', 'All Transfers', 'Water Activities', 'Island Hopping', 'Cultural Shows'],
    isActive: true
  },
  {
    name: '7 Nights 8 Days Family Package',
    category: 'Family',
    duration: '7 Nights 8 Days',
    price: 52000,
    route: '3N Port Blair · 2N Havelock · 2N Neil Island',
    image: 'images/family5.jpeg',
    description: 'Ultimate family vacation with maximum exploration time. Perfect for large families.',
    features: ['Luxury Accommodation', 'All Meals', 'Private Vehicle', 'Adventure Activities', 'Family Entertainment'],
    isActive: true
  },

  // Group Packages
  {
    name: '3 Nights 4 Days Group Package',
    category: 'Group',
    duration: '3 Nights 4 Days',
    price: 13000,
    route: '1N Port Blair · 1N Havelock · 1N Port Blair',
    image: 'images/andaman1.jpg',
    description: 'Budget-friendly group tour covering essential attractions. Perfect for college groups and friends.',
    features: ['Group Accommodation', 'Shared Transfers', 'Major Sightseeing', 'Beach Activities', 'Group Discounts'],
    isActive: true
  },
  {
    name: '4 Nights 5 Days Group Package',
    category: 'Group',
    duration: '4 Nights 5 Days',
    price: 19000,
    route: '2N Port Blair · 1N Havelock · 1N Neil Island',
    image: 'images/andaman2.jpg',
    description: 'Comprehensive group tour with three island visits. Ideal for corporate outings and friend groups.',
    features: ['Group Hotels', 'All Transfers', 'Water Sports', 'Team Activities', 'Group Coordinator'],
    isActive: true
  },
  {
    name: '5 Nights 6 Days Group Package',
    category: 'Group',
    duration: '5 Nights 6 Days',
    price: 28000,
    route: '2N Port Blair · 2N Havelock · 1N Neil Island',
    image: 'images/andaman3.jpg',
    description: 'Extended group vacation with adventure activities. Perfect for large groups seeking fun and adventure.',
    features: ['Budget Hotels', 'Group Activities', 'Adventure Sports', 'Beach Parties', 'Bonfire Nights'],
    isActive: true
  },
  {
    name: '6 Nights 7 Days Group Package',
    category: 'Group',
    duration: '6 Nights 7 Days',
    price: 38000,
    route: '2N Port Blair · 2N Havelock · 2N Neil Island',
    image: 'images/andaman4.jpeg',
    description: 'Relaxed group tour with ample leisure time. Includes all major attractions and group activities.',
    features: ['Comfortable Stay', 'All Sightseeing', 'Water Activities', 'Group Games', 'DJ Night'],
    isActive: true
  },
  {
    name: '7 Nights 8 Days Group Package',
    category: 'Group',
    duration: '7 Nights 8 Days',
    price: 48000,
    route: '3N Port Blair · 2N Havelock · 2N Neil Island',
    image: 'images/andaman5.jpeg',
    description: 'Ultimate group adventure with maximum fun time. Perfect for large corporate groups and reunions.',
    features: ['Premium Stay', 'All Activities', 'Team Building', 'Entertainment', 'Group Photography'],
    isActive: true
  },

  // LTC Packages
  {
    name: '3 Nights 4 Days LTC Package',
    category: 'LTC',
    duration: '3 Nights 4 Days',
    price: 15000,
    route: '1N Port Blair · 1N Havelock · 1N Port Blair',
    image: 'images/andaman6.jpeg',
    description: 'Government employee special LTC package. Includes all necessary documentation and receipts.',
    features: ['LTC Compliant', 'All Receipts', 'Government Hotels', 'Official Documentation', 'Tax Invoices'],
    isActive: true
  },
  {
    name: '4 Nights 5 Days LTC Package',
    category: 'LTC',
    duration: '4 Nights 5 Days',
    price: 22000,
    route: '2N Port Blair · 1N Havelock · 1N Neil Island',
    image: 'images/andaman7.jpeg',
    description: 'Comprehensive LTC tour with proper documentation. Perfect for government employees claiming LTC benefits.',
    features: ['LTC Certified', 'Proper Bills', 'Approved Hotels', 'Travel Certificates', 'GST Invoices'],
    isActive: true
  },
  {
    name: '5 Nights 6 Days LTC Package',
    category: 'LTC',
    duration: '5 Nights 6 Days',
    price: 32000,
    route: '2N Port Blair · 2N Havelock · 1N Neil Island',
    image: 'images/andaman8.jpeg',
    description: 'Extended LTC package with all required documentation. Includes major sightseeing and comfortable stay.',
    features: ['Full Documentation', 'LTC Bills', 'Certified Hotels', 'Travel Proofs', 'Official Receipts'],
    isActive: true
  },
  {
    name: '6 Nights 7 Days LTC Package',
    category: 'LTC',
    duration: '6 Nights 7 Days',
    price: 42000,
    route: '2N Port Blair · 2N Havelock · 2N Neil Island',
    image: 'images/andaman9.jpeg',
    description: 'Relaxed LTC tour with proper billing. Perfect for government employees with family.',
    features: ['LTC Approved', 'Complete Bills', 'Government Rates', 'Travel Documents', 'Tax Compliant'],
    isActive: true
  },
  {
    name: '7 Nights 8 Days LTC Package',
    category: 'LTC',
    duration: '7 Nights 8 Days',
    price: 52000,
    route: '3N Port Blair · 2N Havelock · 2N Neil Island',
    image: 'images/andaman10.jpeg',
    description: 'Ultimate LTC package with maximum coverage. Includes all documentation and comfortable accommodations.',
    features: ['Full LTC Support', 'All Invoices', 'Approved Accommodation', 'Complete Documentation', 'GST Bills'],
    isActive: true
  }
];

async function importPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing packages (optional)
    // await Package.deleteMany({});
    // console.log('Cleared existing packages');

    // Insert packages
    for (const pkg of packages) {
      const existing = await Package.findOne({ name: pkg.name });
      if (!existing) {
        await Package.create(pkg);
        console.log(`✓ Added: ${pkg.name}`);
      } else {
        console.log(`- Skipped (exists): ${pkg.name}`);
      }
    }

    console.log('\n✅ Package import completed!');
    process.exit(0);
  } catch (err) {
    console.error('Error importing packages:', err);
    process.exit(1);
  }
}

importPackages();
