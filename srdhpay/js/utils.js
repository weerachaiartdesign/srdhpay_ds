// utils.js – ฟังก์ชันช่วย
function formatMoney(num) {
  return Number(num).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function getFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  if (now.getMonth() >= 9) return year + 544;
  else return year + 543;
}
function getStatusColor(status) {
  const map = {
    'รับเข้าระบบ': 'blue', 'ตรวจสอบ': 'yellow', 'ส่งแก้ไข': 'orange',
    'ตรวจผ่าน': 'green', 'เสนอ': 'purple', 'อนุมัติ': 'teal', 'จ่ายแล้ว': 'green',
    'ยกเลิก': 'red'
  };
  return map[status] || 'gray';
}

const DEFAULT_PERMISSIONS = {
  dashboard: ['admin','manager','editor','checker','staff','guest'],
  list: ['admin','manager','editor','checker','staff','guest'],
  import: ['admin','manager','staff'],
  receive: ['admin','manager'],
  verify: ['admin','manager','editor'],
  approve: ['admin','manager'],
  payment: ['admin','manager','checker'],
  report: ['admin','manager'],
  auth_profile: ['admin','manager','editor','checker','staff'],
  auth_manage_users: ['admin','manager'],
  settings: ['admin','manager'],
  system: ['admin']
};
