// utils.js - Utility Functions
const Utils = (function() {
  const THAI_MONTHS = ['','ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  
  function formatDateThai(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getDate()} ${THAI_MONTHS[d.getMonth()+1]} ${d.getFullYear()+543}`;
  }
  
  function formatMoney(amount) {
    return Number(amount || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  function formatDisplayRequestNo(raw) {
    if (!raw || raw.length !== 9) return raw || '-';
    const fy = raw.substring(0,2);
    const seq = parseInt(raw.substring(2), 10);
    return `${seq}/${fy}`;
  }
  
  function parseRequestNoInput(input) {
    if (!input || !input.includes('/')) return '';
    const [num, fy] = input.split('/');
    return fy + String(num).padStart(7, '0');
  }
  
  function formatDisplayDkNo(raw) {
    if (!raw || raw.length !== 9) return raw || '-';
    const fy = raw.substring(0,2);
    const seq = parseInt(raw.substring(2), 10);
    return `${seq}/${fy}`;
  }
  
  function parseDkNoInput(input) {
    if (!input || !input.includes('/')) return '';
    const [num, fy] = input.split('/');
    return fy + String(num).padStart(7, '0');
  }
  
  function getStatusColorClass(status) {
    const map = {
      'รอเอกสาร': 'bg-gray-200 text-gray-700',
      'รับเข้าระบบ': 'bg-blue-100 text-blue-700',
      'ตรวจสอบ': 'bg-yellow-100 text-yellow-700',
      'ส่งแก้ไข': 'bg-orange-100 text-orange-700',
      'ตรวจผ่าน': 'bg-green-100 text-green-700',
      'เสนอ': 'bg-indigo-100 text-indigo-700',
      'อนุมัติ': 'bg-purple-100 text-purple-700',
      'จ่ายแล้ว': 'bg-emerald-100 text-emerald-700',
      'ยกเลิก': 'bg-red-100 text-red-700'
    };
    return map[status] || 'bg-gray-200 text-gray-700';
  }
  
  function debounce(func, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
  
  function getFiscalYearDisplay(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.getMonth() >= 9 ? d.getFullYear() + 544 : d.getFullYear() + 543;
  }
  
  return {
    formatDateThai, formatMoney, formatDisplayRequestNo, parseRequestNoInput,
    formatDisplayDkNo, parseDkNoInput, getStatusColorClass, debounce, getFiscalYearDisplay
  };
})();
