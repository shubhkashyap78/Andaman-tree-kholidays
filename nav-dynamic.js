// Dynamic Navigation Dropdown
(async function() {
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://andaman-tree-kholidays.vercel.app/api';

  try {
    const res = await fetch(`${API_URL}/packages`);
    const packages = await res.json();

    // Group packages by category
    const grouped = {
      'Honeymoon': [],
      'Family': [],
      'Group': [],
      'LTC': []
    };

    packages.forEach(pkg => {
      if (grouped[pkg.category]) {
        grouped[pkg.category].push(pkg);
      }
    });

    // Find the submenu container
    const subMenu = document.querySelector('.sub-menu-wide');
    if (!subMenu) return;

    // Clear existing content
    subMenu.innerHTML = '';

    // Build dynamic dropdown
    Object.keys(grouped).forEach(category => {
      const categoryPackages = grouped[category];
      if (categoryPackages.length === 0) return;

      const submenuGroup = document.createElement('li');
      submenuGroup.className = 'submenu-group';
      
      const categorySpan = document.createElement('span');
      categorySpan.textContent = category;
      submenuGroup.appendChild(categorySpan);

      const subSubMenu = document.createElement('ul');
      subSubMenu.className = 'sub-sub';

      categoryPackages.forEach(pkg => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `package-detail.html?id=${pkg._id}`;
        a.textContent = pkg.duration;
        li.appendChild(a);
        subSubMenu.appendChild(li);
      });

      submenuGroup.appendChild(subSubMenu);
      subMenu.appendChild(submenuGroup);
    });

  } catch (err) {
    console.error('Error loading navigation packages:', err);
  }
})();
