// api-config.js – ตั้งค่า endpoint และค่าคงที่
const API_BASE = 'https://script.google.com/macros/s/AKfycbwRhrbz9Lui-xK3no-1o-omtnc9x1g5jxsQa4oIX7VclIoPk5Q229dVVbff1mJWbFSW/exec'; // ใส่ Web App URL จริง
const APP_VERSION = '1.0.0';
const USER_ROLES = ['admin','manager','editor','checker','staff','guest'];

// ฟังก์ชันเรียก API
async function apiCall(action, data = {}) {
  const token = localStorage.getItem('token');
  const payload = { action, ...data };
  if (token) payload.token = token;
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (!result.success) {
      if (result.error === 'Invalid or expired token') {
        localStorage.clear();
        window.location.href = 'index.html';
        return;
      }
      throw new Error(result.error);
    }
    return result.data;
  } catch (e) {
    if (e.message !== 'Invalid or expired token') {
      Swal.fire('ผิดพลาด', e.message, 'error');
    }
    throw e;
  }
}
