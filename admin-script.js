const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('adminToken');

// LOGIN
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminName', data.admin.username);
      authToken = data.token;
      showDashboard();
    } else {
      document.getElementById('loginError').textContent = data.error;
    }
  } catch (err) {
    document.getElementById('loginError').textContent = 'Connection error';
  }
});

// LOGOUT
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminName');
  location.reload();
});

// SHOW DASHBOARD
function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';
  document.getElementById('adminName').textContent = localStorage.getItem('adminName');
  loadDashboardStats();
}

// CHECK AUTH
if (authToken) {
  showDashboard();
}

// NAVIGATION
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.id === 'logoutBtn') return;
    e.preventDefault();
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    const section = link.dataset.section;
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.getElementById(`${section}Section`).style.display = 'block';
    
    document.getElementById('pageTitle').textContent = link.textContent.trim();
    
    if (section === 'dashboard') loadDashboardStats();
    else if (section === 'packages') loadPackages();
    else if (section === 'activities') loadActivities();
    else if (section === 'testimonials') loadTestimonials();
    else if (section === 'bookings') loadBookings();
    else if (section === 'contacts') loadContacts();
  });
});

// DASHBOARD STATS
async function loadDashboardStats() {
  try {
    const res = await fetch(`${API_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const stats = await res.json();
    
    document.getElementById('statPackages').textContent = stats.totalPackages;
    document.getElementById('statActivities').textContent = stats.totalActivities;
    document.getElementById('statBookings').textContent = stats.totalBookings;
    document.getElementById('statPending').textContent = stats.pendingBookings;
    document.getElementById('statContacts').textContent = stats.totalContacts;
    document.getElementById('statNewContacts').textContent = stats.newContacts;
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

// PACKAGES
async function loadPackages() {
  try {
    const res = await fetch(`${API_URL}/admin/packages`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const packages = await res.json();
    
    const tbody = document.querySelector('#packagesTable tbody');
    tbody.innerHTML = packages.map(pkg => `
      <tr>
        <td>${pkg.name}</td>
        <td>${pkg.duration}</td>
        <td>₹${pkg.price}</td>
        <td><span class="status-badge status-${pkg.isActive ? 'active' : 'inactive'}">${pkg.isActive ? 'Active' : 'Inactive'}</span></td>
        <td>
          <button class="btn-edit" onclick="editPackage('${pkg._id}')">Edit</button>
          <button class="btn-delete" onclick="deletePackage('${pkg._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading packages:', err);
  }
}

function showAddPackageModal() {
  document.getElementById('packageModalTitle').textContent = 'Add Package';
  document.getElementById('packageForm').reset();
  document.getElementById('packageId').value = '';
  document.getElementById('packageModal').style.display = 'block';
}

async function editPackage(id) {
  try {
    const res = await fetch(`${API_URL}/admin/packages`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const packages = await res.json();
    const pkg = packages.find(p => p._id === id);
    
    document.getElementById('packageModalTitle').textContent = 'Edit Package';
    document.getElementById('packageId').value = pkg._id;
    document.getElementById('packageName').value = pkg.name;
    document.getElementById('packageDuration').value = pkg.duration;
    document.getElementById('packagePrice').value = pkg.price;
    document.getElementById('packageImage').value = pkg.image;
    document.getElementById('packageDescription').value = pkg.description;
    document.getElementById('packageFeatures').value = pkg.features?.join(', ') || '';
    document.getElementById('packageActive').checked = pkg.isActive;
    document.getElementById('packageModal').style.display = 'block';
  } catch (err) {
    console.error('Error loading package:', err);
  }
}

document.getElementById('packageForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('packageId').value;
  const data = {
    name: document.getElementById('packageName').value,
    duration: document.getElementById('packageDuration').value,
    price: document.getElementById('packagePrice').value,
    image: document.getElementById('packageImage').value,
    description: document.getElementById('packageDescription').value,
    features: document.getElementById('packageFeatures').value.split(',').map(f => f.trim()),
    isActive: document.getElementById('packageActive').checked
  };
  
  try {
    const url = id ? `${API_URL}/admin/packages/${id}` : `${API_URL}/admin/packages`;
    const method = id ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data)
    });
    
    closeModal('packageModal');
    loadPackages();
  } catch (err) {
    console.error('Error saving package:', err);
  }
});

async function deletePackage(id) {
  if (!confirm('Delete this package?')) return;
  
  try {
    await fetch(`${API_URL}/admin/packages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    loadPackages();
  } catch (err) {
    console.error('Error deleting package:', err);
  }
}

// ACTIVITIES
async function loadActivities() {
  try {
    const res = await fetch(`${API_URL}/admin/activities`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const activities = await res.json();
    
    const tbody = document.querySelector('#activitiesTable tbody');
    tbody.innerHTML = activities.map(act => `
      <tr>
        <td>${act.name}</td>
        <td>₹${act.price}</td>
        <td><span class="status-badge status-${act.isActive ? 'active' : 'inactive'}">${act.isActive ? 'Active' : 'Inactive'}</span></td>
        <td>
          <button class="btn-edit" onclick="editActivity('${act._id}')">Edit</button>
          <button class="btn-delete" onclick="deleteActivity('${act._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading activities:', err);
  }
}

function showAddActivityModal() {
  document.getElementById('activityModalTitle').textContent = 'Add Activity';
  document.getElementById('activityForm').reset();
  document.getElementById('activityId').value = '';
  document.getElementById('activityModal').style.display = 'block';
}

async function editActivity(id) {
  try {
    const res = await fetch(`${API_URL}/admin/activities`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const activities = await res.json();
    const act = activities.find(a => a._id === id);
    
    document.getElementById('activityModalTitle').textContent = 'Edit Activity';
    document.getElementById('activityId').value = act._id;
    document.getElementById('activityName').value = act.name;
    document.getElementById('activityPrice').value = act.price;
    document.getElementById('activityImage').value = act.image;
    document.getElementById('activityIcon').value = act.icon || '';
    document.getElementById('activityDescription').value = act.description;
    document.getElementById('activityActive').checked = act.isActive;
    document.getElementById('activityModal').style.display = 'block';
  } catch (err) {
    console.error('Error loading activity:', err);
  }
}

document.getElementById('activityForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('activityId').value;
  const data = {
    name: document.getElementById('activityName').value,
    price: document.getElementById('activityPrice').value,
    image: document.getElementById('activityImage').value,
    icon: document.getElementById('activityIcon').value,
    description: document.getElementById('activityDescription').value,
    isActive: document.getElementById('activityActive').checked
  };
  
  try {
    const url = id ? `${API_URL}/admin/activities/${id}` : `${API_URL}/admin/activities`;
    const method = id ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data)
    });
    
    closeModal('activityModal');
    loadActivities();
  } catch (err) {
    console.error('Error saving activity:', err);
  }
});

async function deleteActivity(id) {
  if (!confirm('Delete this activity?')) return;
  
  try {
    await fetch(`${API_URL}/admin/activities/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    loadActivities();
  } catch (err) {
    console.error('Error deleting activity:', err);
  }
}

// TESTIMONIALS
async function loadTestimonials() {
  try {
    const res = await fetch(`${API_URL}/admin/testimonials`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const testimonials = await res.json();
    
    const tbody = document.querySelector('#testimonialsTable tbody');
    tbody.innerHTML = testimonials.map(test => `
      <tr>
        <td>${test.name}</td>
        <td>${test.review.substring(0, 50)}...</td>
        <td>${'⭐'.repeat(test.rating)}</td>
        <td>${test.reviewDate}</td>
        <td>
          <button class="btn-edit" onclick="editTestimonial('${test._id}')">Edit</button>
          <button class="btn-delete" onclick="deleteTestimonial('${test._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading testimonials:', err);
  }
}

function showAddTestimonialModal() {
  document.getElementById('testimonialModalTitle').textContent = 'Add Testimonial';
  document.getElementById('testimonialForm').reset();
  document.getElementById('testimonialId').value = '';
  document.getElementById('testimonialModal').style.display = 'block';
}

async function editTestimonial(id) {
  try {
    const res = await fetch(`${API_URL}/admin/testimonials`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const testimonials = await res.json();
    const test = testimonials.find(t => t._id === id);
    
    document.getElementById('testimonialModalTitle').textContent = 'Edit Testimonial';
    document.getElementById('testimonialId').value = test._id;
    document.getElementById('testimonialName').value = test.name;
    document.getElementById('testimonialInitials').value = test.initials;
    document.getElementById('testimonialReview').value = test.review;
    document.getElementById('testimonialRating').value = test.rating;
    document.getElementById('testimonialDate').value = test.reviewDate;
    document.getElementById('testimonialActive').checked = test.isActive;
    document.getElementById('testimonialModal').style.display = 'block';
  } catch (err) {
    console.error('Error loading testimonial:', err);
  }
}

document.getElementById('testimonialForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('testimonialId').value;
  const data = {
    name: document.getElementById('testimonialName').value,
    initials: document.getElementById('testimonialInitials').value,
    review: document.getElementById('testimonialReview').value,
    rating: document.getElementById('testimonialRating').value,
    reviewDate: document.getElementById('testimonialDate').value,
    isActive: document.getElementById('testimonialActive').checked
  };
  
  try {
    const url = id ? `${API_URL}/admin/testimonials/${id}` : `${API_URL}/admin/testimonials`;
    const method = id ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data)
    });
    
    closeModal('testimonialModal');
    loadTestimonials();
  } catch (err) {
    console.error('Error saving testimonial:', err);
  }
});

async function deleteTestimonial(id) {
  if (!confirm('Delete this testimonial?')) return;
  
  try {
    await fetch(`${API_URL}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    loadTestimonials();
  } catch (err) {
    console.error('Error deleting testimonial:', err);
  }
}

// BOOKINGS
async function loadBookings() {
  try {
    const res = await fetch(`${API_URL}/admin/bookings`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const bookings = await res.json();
    
    const tbody = document.querySelector('#bookingsTable tbody');
    tbody.innerHTML = bookings.map(book => `
      <tr>
        <td>${book.name}</td>
        <td>${book.email}</td>
        <td>${book.phone}</td>
        <td>${book.package || book.activity || '-'}</td>
        <td>${book.date ? new Date(book.date).toLocaleDateString() : '-'}</td>
        <td><span class="status-badge status-${book.status}">${book.status}</span></td>
        <td>
          <select onchange="updateBookingStatus('${book._id}', this.value)">
            <option value="pending" ${book.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${book.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="cancelled" ${book.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading bookings:', err);
  }
}

async function updateBookingStatus(id, status) {
  try {
    await fetch(`${API_URL}/admin/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });
    loadBookings();
  } catch (err) {
    console.error('Error updating booking:', err);
  }
}

// CONTACTS
async function loadContacts() {
  try {
    const res = await fetch(`${API_URL}/admin/contacts`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const contacts = await res.json();
    
    const tbody = document.querySelector('#contactsTable tbody');
    tbody.innerHTML = contacts.map(contact => `
      <tr>
        <td>${contact.name}</td>
        <td>${contact.email}</td>
        <td>${contact.phone}</td>
        <td>${contact.package || '-'}</td>
        <td>${contact.message?.substring(0, 50) || '-'}...</td>
        <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
        <td>
          <select onchange="updateContactStatus('${contact._id}', this.value)">
            <option value="new" ${contact.status === 'new' ? 'selected' : ''}>New</option>
            <option value="contacted" ${contact.status === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="closed" ${contact.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading contacts:', err);
  }
}

async function updateContactStatus(id, status) {
  try {
    await fetch(`${API_URL}/admin/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ status })
    });
    loadContacts();
  } catch (err) {
    console.error('Error updating contact:', err);
  }
}

// MODAL CLOSE
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}
