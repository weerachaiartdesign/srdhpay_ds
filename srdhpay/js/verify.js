// verify.js – ส่งแก้ไข, รับคืน, ตรวจผ่าน
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnEdit')?.addEventListener('click', editAction);
  document.getElementById('btnReturn')?.addEventListener('click', returnAction);
  document.getElementById('btnPass')?.addEventListener('click', passAction);
  loadVerifyTable();
});

async function loadVerifyTable() {
  const filterStatus = document.getElementById('filterStatus')?.value || '';
  const filterMoney = document.getElementById('filterMoney')?.value || '';
  const filterDept = document.getElementById('filterDept')?.value || '';
  const filterSender = document.getElementById('filterSender')?.value || '';
  const filterVendor = document.getElementById('filterVendor')?.value || '';

  const data = await apiCall('list', { 
    module: 'verify',
    filters: { status: filterStatus, moneyType: filterMoney, dept: filterDept, sender: filterSender, vendor: filterVendor }
  });
  const rows = data.rows.filter(r => ['ตรวจสอบ','ส่งแก้ไข'].includes(r.STATUS));
  renderVerifyTable(rows);
}

function renderVerifyTable(rows) {
  const div = document.getElementById('verifyTable');
  if (!div) return;
  div.innerHTML = `
    <table class="w-full text-sm">
      <thead><tr>
        <th><input type="checkbox" id="selectAll"></th>
        <th>เลขที่ลงทะเบียน</th><th>ใบขอเบิก/ฎีกา</th><th>ผู้ขาย</th>
        <th>จำนวนเงิน</th><th>สถานะ</th><th>ผู้ตรวจ</th>
      </tr></thead>
      <tbody>
        ${rows.map(r => `<tr>
          <td><input type="checkbox" value="${r.UUID}" data-status="${r.STATUS}"></td>
          <td>${r.REGISTER_NO_DISPLAY}<br><small>${r.REGISTER_DATE}</small></td>
          <td>${r.REQUEST_NO_DISPLAY}<br>${r.DK_NO_DISPLAY || '-'}</td>
          <td>${r.VENDOR}</td>
          <td class="font-bold">${formatMoney(r.AMOUNT)}</td>
          <td>${r.STATUS}</td>
          <td>${r.EDITOR || '-'}</td>
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

async function editAction() {
  const uuids = getSelectedUuids(['ตรวจสอบ','ส่งแก้ไข']);
  if (!uuids.length) { Swal.fire('กรุณาเลือก', 'เลือกรายการสถานะ ตรวจสอบ หรือ ส่งแก้ไข', 'warning'); return; }
  await apiCall('verifyEdit', { uuids });
  Swal.fire('บันทึกแก้ไข', 'เปลี่ยนสถานะเป็นส่งแก้ไขแล้ว', 'success');
  loadVerifyTable();
  // เปิด print preview (ถ้าต้องการ)
}

async function returnAction() {
  const uuids = getSelectedUuids(['ส่งแก้ไข']);
  if (!uuids.length) { Swal.fire('กรุณาเลือก', 'เลือกรายการสถานะ ส่งแก้ไข เท่านั้น', 'warning'); return; }
  await apiCall('verifyReturn', { uuids });
  Swal.fire('รับคืน', 'สถานะกลับเป็นตรวจสอบ', 'success');
  loadVerifyTable();
}

async function passAction() {
  const uuids = getSelectedUuids(['ตรวจสอบ']);
  if (!uuids.length) { Swal.fire('กรุณาเลือก', 'เลือกรายการสถานะ ตรวจสอบ', 'warning'); return; }
  
  // ถ้าบางรายการ DK_NO ว่าง ต้องให้กรอก
  const dkPrompts = [];
  for (let uuid of uuids) {
    const row = await apiCall('detail', { uuid });
    if (!row.DK_NO) {
      const { value } = await Swal.fire({
        title: `กรุณากรอกเลขที่ฎีกาสำหรับรายการ ${row.REQUEST_NO_DISPLAY}`,
        input: 'text',
        inputPlaceholder: '1801/69',
        showCancelButton: true,
        inputValidator: (val) => !val ? 'ต้องกรอก' : null
      });
      if (!value) return; // ยกเลิก
      dkPrompts.push({ uuid, dkNo: value });
    }
  }

  const dkNos = uuids.map(uuid => {
    const found = dkPrompts.find(d => d.uuid === uuid);
    return found ? found.dkNo : '';
  });

  await apiCall('verifyPass', { uuids, dkNos });
  Swal.fire('ตรวจผ่าน', 'เปลี่ยนสถานะเป็นตรวจผ่านแล้ว', 'success');
  loadVerifyTable();
}

// ตั้งค่า event listeners เมื่อโหลด
(function() {
  const html = `
    <div class="flex space-x-2 my-3">
      <button id="btnEdit" class="bg-purple-600 text-white px-4 py-2 rounded">แก้ไข → ส่งแก้ไข</button>
      <button id="btnReturn" class="bg-purple-600 text-white px-4 py-2 rounded">รับคืน → ตรวจสอบ</button>
      <button id="btnPass" class="bg-purple-600 text-white px-4 py-2 rounded">ตรวจผ่าน → ผ่าน</button>
      <button id="btnPrint" class="bg-gray-600 text-white px-4 py-2 rounded">พิมพ์ใบส่งแก้ไข</button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3" id="filterBar">
      <select id="filterStatus" class="p-2 border rounded dark:bg-gray-700 dark:text-white">
        <option value="">ทุกสถานะ</option>
        <option>ตรวจสอบ</option><option>ส่งแก้ไข</option>
      </select>
      <select id="filterMoney" class="p-2 border rounded dark:bg-gray-700 dark:text-white"></select>
      <select id="filterDept" class="p-2 border rounded dark:bg-gray-700 dark:text-white"></select>
      <input id="filterSender" placeholder="ผู้ส่งเอกสาร" class="p-2 border rounded dark:bg-gray-700 dark:text-white">
      <input id="filterVendor" placeholder="ชื่อเจ้าหนี้" class="p-2 border rounded dark:bg-gray-700 dark:text-white">
    </div>
    <div id="verifyTable" class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto"></div>
  `;
  // inject ลง container (แต่เนื่องจาก verify.html มี container แล้ว เราจะใช้ outerHTML หรือเราจะ append)
  // วิธีง่ายๆ: ใช้ document.body onload เพื่อเพิ่ม html หลัง sidebar
  window.addEventListener('load', () => {
    const container = document.getElementById('verifyTable');
    if (container) {
      container.parentNode.insertBefore(createElementFromHTML(html).firstChild, container);
    }
  });
})();

function createElementFromHTML(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}