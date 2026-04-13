const API_URL = 'http://localhost:5000/api';

// LOAD DYNAMIC TESTIMONIALS
async function loadTestimonials() {
  try {
    const res = await fetch(`${API_URL}/testimonials`);
    const testimonials = await res.json();
    
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (testimonialGrid && testimonials.length) {
      testimonialGrid.innerHTML = testimonials.map(test => `
        <div class="testimonial-card">
          <div class="testimonial-head">
            <div class="avatar">${test.initials}</div>
            <div>
              <h4>${test.name}</h4>
              <p>Reviewed: ${test.reviewDate}</p>
            </div>
          </div>
          <p>${test.review}</p>
          <div class="stars">${'★'.repeat(test.rating)}</div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.log('Using static testimonials');
  }
}

// CONTACT FORM SUBMISSION
async function submitContactForm(formData) {
  try {
    await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return true;
  } catch (err) {
    return true;
  }
}

// BOOKING SUBMISSION
async function submitBooking(formData) {
  try {
    await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return true;
  } catch (err) {
    return true;
  }
}

// LOAD DYNAMIC PACKAGES
async function loadDynamicPackages() {
  try {
    const res = await fetch(`${API_URL}/packages`);
    const packages = await res.json();
    
    return packages.map(pkg => ({
      id: pkg._id,
      category: pkg.name.includes('Honeymoon') ? 'Honeymoon' : 
                pkg.name.includes('Adventure') ? 'Adventure' :
                pkg.name.includes('Family') ? 'Family' :
                pkg.name.includes('Group') ? 'Group' :
                pkg.name.includes('LTC') ? 'LTC' : 'Best Seller',
      duration: pkg.duration,
      price: pkg.price,
      title: pkg.name,
      image: pkg.image,
      route: pkg.description.substring(0, 50),
      details: pkg.features || []
    }));
  } catch (err) {
    return null;
  }
}

// LOAD DYNAMIC ACTIVITIES
async function loadDynamicActivities() {
  try {
    const res = await fetch(`${API_URL}/activities`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadTestimonials, submitContactForm, submitBooking, loadDynamicPackages, loadDynamicActivities };
}
