// list.js – รายการเบิกจ่าย
let currentPage = 1, perPage = 50, filters = {}, search = '';

document.addEventListener('DOMContentLoaded', async () => {
  await loadFilters();
  document.getElementById('searchBox').addEventListener('input', (e) => { search = e.target.value; loadList(); });
  document.getElementById('perPage').addEventListener('change', (e) => { perPage = e.target.value; loadList(); });
  // filter change events
  loadList();
});

async function loadList() {
  const data = await apiCall('list', { page: currentPage, perPage, filters, search });
  renderTable(data.rows);
  renderPagination(data.total);
  renderMobileCards(data.rows);
}

function renderTable(rows) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = rows.map(r => `
    <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td class="p-2">${r.RECEIVE_DATE}<br>${r.RECEIVE_NO_DISPLAY}</td>
      <td>${r.STATUS}</td>
      <td>${r.REQUEST_NO_DISPLAY}<br>${r.DK_NO_DISPLAY}</td>
      <td class="font-bold">${r.VENDOR}</td>
      <td>${r.DESCRIPTION}</td>
      <td class="font-bold">${formatMoney(r.AMOUNT)}</td>
      <td>${r.MONEY_TYPE}<br>${r.DEPT}</td>
      <td><button onclick="openDetail('${r.UUID}')" class="text-purple-600 hover:underline">ดู</button></td>
    </tr>
  `).join('');
}

async function openDetail(uuid) {
  const detail = await apiCall('detail', { uuid });
  const html = `
    <div class="text-left space-y-2">
      <p><b>เลขที่รับ:</b> ${detail.RECEIVE_NO_DISPLAY}</p>
      <p><b>ใบขอเบิก:</b> ${detail.REQUEST_NO_DISPLAY}</p>
      <p><b>ฎีกา:</b> ${detail.DK_NO_DISPLAY||'-'}</p>
      <p><b>ประเภทเงิน:</b> ${detail.MONEY_TYPE}</p>
      <p><b>หน่วยงาน:</b> ${detail.DEPT}</p>
      <p><b>ผู้ขาย:</b> ${detail.VENDOR}</p>
      <p><b>จำนวนเงิน:</b> ${formatMoney(detail.AMOUNT)}</p>
      <p><b>รายการ:</b> ${detail.DESCRIPTION}</p>
      <div class="mt-4">Timeline: รับเข้าระบบ → ${detail.STATUS}</div>
    </div>`;
  Swal.fire({ title: 'รายละเอียดรายการ', html, width: '600px', confirmButtonText: 'ปิด' });
}

function renderMobileCards(rows) {
  const container = document.getElementById('mobileCards');
  container.innerHTML = rows.map(r => `
    <div class="bg-white dark:bg-gray-800 p-3 rounded-xl shadow">
      <div class="flex justify-between"><span>${r.RECEIVE_DATE}</span><span>${r.STATUS}</span></div>
      <div class="font-bold">${r.VENDOR}</div>
      <div>${r.DESCRIPTION}</div>
      <div class="text-right text-lg font-bold">${formatMoney(r.AMOUNT)}</div>
    </div>
  `).join('');
}