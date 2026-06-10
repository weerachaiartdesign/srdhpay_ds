// api-config.js – ตั้งค่า endpoint และค่าคงที่ผ่าน Proxy หลังบ้าน

// 🔧 เปลี่ยน URL ตรงนี้ให้เป็นลิงก์ของ Cloudflare Workers ตัวใหม่ของคุณแทนครับ
const API_BASE = 'https://ใส่ชื่อโปรเจกต์ของคุณ.ชื่อผู้ใช้.workers.dev'; 

const APP_VERSION = '1.0.0';
const USER_ROLES = ['admin','manager','editor','checker','staff','guest'];

// ฟังก์ชันเรียก API
async function apiCall(action, data = {}) {
  const token = localStorage.getItem('token');
  const payload = { action, ...data };
  if (token) payload.token = token;
  try {
    // ระบบจะยิงข้อมูลไปที่ Cloudflare Workers แทนการยิงตรงเข้า GAS เพื่อซ่อน URL ปลายทาง
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
      // ตรวจสอบว่ามีคลังสคริปต์ SweetAlert2 (Swal) ในระบบหน้าบ้านไหม หากมีจะแสดงผลแจ้งเตือนอย่างสวยงาม
      if (typeof Swal !== 'undefined') {
        Swal.fire('ผิดพลาด', e.message, 'error');
      } else {
        alert('ผิดพลาด: ' + e.message);
      }
    }
    throw e;
  }
}
