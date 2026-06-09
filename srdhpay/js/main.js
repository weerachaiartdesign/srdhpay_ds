// main.js - Core Application Logic
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  checkAuth();
  setupThemeToggle();
  setupSidebar();
  setupKeyboardShortcuts();
  loadSidebarHTML();
}

// Authentication Guard
function checkAuth() {
  const token = localStorage.getItem('srdh_token');
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!token && currentPage !== 'index.html' && currentPage !== '') {
    window.location.href = 'index.html';
  }
}

// Theme Management
function setupThemeToggle() {
  const isDark = localStorage.getItem('srdh_dark_mode') === 'true';
  document.documentElement.classList.toggle('dark', isDark);
  
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
    toggleBtn.addEventListener('click', () => {
      const newDark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', newDark);
      localStorage.setItem('srdh_dark_mode', newDark);
      toggleBtn.innerHTML = newDark ? '☀️' : '🌙';
    });
  }
}

// Sidebar Loading
async function loadSidebarHTML() {
  const sidebarContainer = document.getElementById('sidebarContainer');
  if (sidebarContainer) {
    try {
      const response = await fetch('sidebar.html');
      const html = await response.text();
      sidebarContainer.innerHTML = html;
      setupSidebar();
      highlightCurrentPage();
    } catch (e) {
      console.error('Failed to load sidebar:', e);
    }
  }
}

function setupSidebar() {
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      sidebar.classList.toggle('flex');
    });
  }
}

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop();
  const links = document.querySelectorAll('#sidebar a');
  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('bg-purple-100', 'dark:bg-purple-900', 'font-bold');
    }
  });
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      const saveBtn = document.querySelector('[data-shortcut="save"]');
      if (saveBtn) saveBtn.click();
    }
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      const searchBox = document.querySelector('input[type="search"], input[placeholder*="ค้นหา"]');
      if (searchBox) searchBox.focus();
    }
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal:not(.hidden)');
      if (modal) modal.classList.add('hidden');
    }
  });
}

// Logout Function
async function logout() {
  const result = await Swal.fire({
    title: 'ยืนยันการออกจากระบบ',
    text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ออกจากระบบ',
    cancelButtonText: 'ยกเลิก'
  });
  
  if (result.isConfirmed) {
    try {
      await apiCall('logout');
    } catch (e) {
      // Ignore logout errors
    }
    localStorage.removeItem('srdh_token');
    localStorage.removeItem('srdh_user');
    window.location.href = 'index.html';
  }
}

// User Info
function getUserInfo() {
  const userStr = localStorage.getItem('srdh_user');
  return userStr ? JSON.parse(userStr) : null;
}

// Toast Notification
function showToast(message, type = 'success') {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
  Toast.fire({ icon: type, title: message });
}
