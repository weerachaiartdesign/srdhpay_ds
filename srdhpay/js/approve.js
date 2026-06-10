// approve.js
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnPropose')?.addEventListener('click', proposeAction);
  document.getElementById('btnApprove')?.addEventListener('click', approveAction);
  loadApproveTable();
});

async function loadApproveTable() {
  const filterStatus = document.getElementById('filterStatus')?.value || '';
  const filterMoney = document.getElementById('filterMoney')?.value || '';
  const filterDept = document.getElementById('filterDept')?.value || '';
  const filterSender = document.getElementById('filterSender')?.value || '';
  const filterVendor = document.getElementById('filterVendor')?.value || '';

  const data = await apiCall('list', { 
    module: 'approve',
    filters: { status: filterStatus, moneyType: filterMoney, dept: filterDept, sender: filterSender, vendor: filterVendor }
  });
  const rows = data.rows.filter(r => ['ตรวจผ่าน','เสนอ'].includes(r.STATUS));
  renderApproveTable(rows);
}

function renderApproveTable(rows) {
  const div = document.getElementById('approveTable');
  if (!div) return;
  div.innerHTML = `
    <table class="w-full text-sm">
      <thead><tr>
        <th><input type="checkbox" id="selectAll"></th>
        <th>เลขที่ฎีกา</th><th>ใบขอเบิก</th><th>ผู้ขาย</th><th>รายการ</th>
        <th>จำนวนเงิน</th><th>สถานะ</th>
      </tr></thead>
      <tbody>
        ${rows.map(r => `<tr>
          <td><input type="checkbox" value="${r.UUID}" data-status="${r.STATUS}"></td>
          <td>${r.DK_NO_DISPLAY || '-'}</td>
          <td>${r.REQUEST_NO_DISPLAY}</td>
          <td>${r.VENDOR}</td>
          <td>${r.DESCRIPTION}</td>
          <td class="font-bold">${formatMoney(r.AMOUNT)}</td>
          <td>${r.STATUS}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  
  document.getElementById('selectAll').addEventListener('change', function() {
    document.querySelectorAll('tbody input[type="checkbox"]').forEach(cb => cb.checked = this.checked);
  });
}

function getSelectedUuids(allowedStatuses = []) {
  const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
  const uuids = [];
  checkboxes.forEach(cb => {
    const status = cb.dataset.status;
    if (!allowedStatuses.length || allowedStatuses.includes(status)) uuids.push(cb.value);
  });
  return uuids;
}

async function proposeAction() {
  const uuids = getSelectedUuids(['ตรวจผ่าน']);
  if (!uuids.length) { Swal.fire('กรุณาเลือก', 'เลือกรายการสถานะ ตรวจผ่าน เท่านั้น', 'warning'); return; }
  await apiCall('approvePropose', { uuids });
  Swal.fire('เสนอ', 'เปลี่ยนสถานะเป็นเสนอแล้ว', 'success');
  loadApproveTable();
}

async function approveAction() {
  const uuids = getSelectedUuids(['เสนอ']);
  if (!uuids.length) { Swal.fire('กรุณาเลือก', 'เลือกรายการสถานะ เสนอ เท่านั้น', 'warning'); return; }
  await apiCall('approveApprove', { uuids });
  Swal.fire('อนุมัติ', 'เปลี่ยนสถานะเป็นอนุมัติแล้ว', 'success');
  loadApproveTable();
}

// Inject HTML elements (เช่นเดียวกับ verify)
(function() {
  window.addEventListener('load', () => {
    const container = document.getElementById('approveTable');
    if (container) {
      const filterBar = document.createElement('div');
      filterBar.className = 'grid grid-cols-2 md:grid-cols-5 gap-2 mb-3';
      filterBar.innerHTML = `
        <select id="filterStatus" class="p-2 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">ทุกสถานะ</option>
          <option>ตรวจผ่าน</option><option>เสนอ</option>
        </select>
        <select id="filterMoney" class="p-2 border rounded dark:bg-gray-700 dark:text-white"></select>
        <select id="filterDept" class="p-2 border rounded dark:bg-gray-700 dark:text-white"></select>
        <input id="filterSender" placeholder="ผู้ส่งเอกสาร" class="p-2 border rounded dark:bg-gray-700 dark:text-white">
        <input id="filterVendor" placeholder="ชื่อเจ้าหนี้" class="p-2 border rounded dark:bg-gray-700 dark:text-white">
      `;
      const btnGroup = document.createElement('div');
      btnGroup.className = 'flex space-x-2 my-3';
      btnGroup.innerHTML = `
        <button id="btnPropose" class="bg-purple-600 text-white px-4 py-2 rounded">ส่งเสนอ</button>
        <button id="btnApprove" class="bg-purple-600 text-white px-4 py-2 rounded">อนุมัติ</button>
        <button id="btnPrint" class="bg-gray-600 text-white px-4 py-2 rounded">พิมพ์ใบบันทึกเสนอ</button>
      `;
      container.parentNode.insertBefore(btnGroup, container);
      container.parentNode.insertBefore(filterBar, container);
      // re-assign event after insert
      document.getElementById('btnPropose').addEventListener('click', proposeAction);
      document.getElementById('btnApprove').addEventListener('click', approveAction);
      document.querySelectorAll('#filterBar select, #filterBar input').forEach(el => el.addEventListener('change', loadApproveTable));
    }
  });
})();