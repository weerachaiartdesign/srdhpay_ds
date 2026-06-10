// main.js – เพิ่ม hamburger, sidebar role filter
(async function() {
  if (window.location.pathname.endsWith('index.html')) return;
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = 'index.html'; return; }
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const sidebarContainer = document.getElementById('sidebarContainer');
  if (sidebarContainer) {
    const resp = await fetch('sidebar.html');
    const html = await resp.text();
    sidebarContainer.innerHTML = html;
    // ซ่อนเมนูที่ไม่มีสิทธิ์
    const menuItems = sidebarContainer.querySelectorAll('nav a');
    menuItems.forEach(a => {
      const module = a.dataset.module;
      if (module && user.role && !DEFAULT_PERMISSIONS[module]?.includes(user.role)) {
        a.style.display = 'none';
      }
    });
    // active page
    const currentPage = window.location.pathname.split('/').pop();
    menuItems.forEach(a => { if (a.getAttribute('href') === currentPage) a.classList.add('bg-purple-100','dark:bg-gray-700','font-semibold'); });
    // logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const confirm = await Swal.fire({ title: 'ออกจากระบบ?', icon: 'question', showCancelButton: true });
        if (confirm.isConfirmed) {
          await apiCall('logout');
          localStorage.clear();
          window.location.href = 'index.html';
        }
      });
    }
  }
  // Dark toggle
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
      darkToggle.textContent = document.documentElement.classList.contains('dark') ? '🌙' : '☀️';
    });
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
      darkToggle.textContent = '🌙';
    }
  }
  // Hamburger
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    const hamburger = document.createElement('button');
    hamburger.className = 'lg:hidden fixed top-4 left-4 z-50 p-2 rounded bg-white dark:bg-gray-800 shadow';
    hamburger.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
    document.body.appendChild(hamburger);
    hamburger.addEventListener('click', () => sidebar.classList.toggle('show'));
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && e.target !== hamburger && window.innerWidth < 1024) sidebar.classList.remove('show');
    });
    window.addEventListener('resize', () => { if (window.innerWidth >= 1024) sidebar.classList.remove('show'); });
  }
})();
